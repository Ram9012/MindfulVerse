from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import uuid
import sys
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from gemini_service import setup_gemini, generate_response, transcribe_audio_with_gemini
import json
from classification_model import detect_emotions, detect_themes, detect_distortions, generate_summary


# Load environment variables from .env file
load_dotenv()

# Initialize Gemini models with API key from environment variable
gemini_api_key = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
gemini_models = setup_gemini(gemini_api_key)

if gemini_models is None:
    print("Warning: Gemini models failed to initialize. Chat and audio transcription will not work.")
else:
    print("Gemini models initialized successfully for both chat and audio transcription.")

# We no longer need the Qwen2 model as we'll use Gemini for audio transcription

app = Flask(__name__)
# We'll handle CORS manually instead of using the Flask-CORS extension
# to avoid duplicate headers

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        origin = request.headers.get('Origin')
        
        # List of allowed origins - allow all origins during development
        allowed_origins = [
            'http://localhost:8080', 
            'http://127.0.0.1:8080', 
            'http://localhost:8081', 
            'http://127.0.0.1:8081',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ]
        
        # For development, allow all origins
        # Comment this out in production
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)
        
        # If the origin is in our allowed list
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    # Get the origin from the request headers
    origin = request.headers.get('Origin')
    
    # List of allowed origins - allow all origins during development
    allowed_origins = [
        'http://localhost:8080', 
        'http://127.0.0.1:8080', 
        'http://localhost:8081', 
        'http://127.0.0.1:8081',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ]
    
    # For development, allow all origins
    # Comment this out in production
    if origin and origin not in allowed_origins:
        allowed_origins.append(origin)
    
    # If the origin is in our allowed list
    if origin in allowed_origins:
        # Set the CORS headers (only once)
        if 'Access-Control-Allow-Origin' not in response.headers:
            response.headers['Access-Control-Allow-Origin'] = origin
        if 'Access-Control-Allow-Methods' not in response.headers:
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        if 'Access-Control-Allow-Headers' not in response.headers:
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        if 'Access-Control-Allow-Credentials' not in response.headers:
            response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    return response

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
# Remove the custom identity claim to use the default
# app.config['JWT_IDENTITY_CLAIM'] = 'sub'
jwt = JWTManager(app)

# Configure SQLite database with absolute path to ensure persistence
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'mindful_verse.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') # Secret key for session management

# Ensure the database directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Print the database path for debugging
print(f"Database path: {db_path}")

# Serve static files from upload folder
app.static_folder = os.path.join(basedir, '..')
app.static_url_path = ''

db = SQLAlchemy(app)

# Define database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    profile_picture = db.Column(db.String(255))
    role = db.Column(db.String(20), default='patient')  # 'patient' or 'therapist'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'profile_picture': self.profile_picture,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_type = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer)  # duration in minutes
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create database tables
with app.app_context():
    # Create all tables if they don't exist
    db.create_all()

# API Routes
@app.route('/api/register', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided', 'field': None}), 400
            
        # Check required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field', 'field': field}), 400
            if not data[field] or not isinstance(data[field], str) or not data[field].strip():
                return jsonify({'error': f'Invalid {field}', 'field': field}), 400
        
        # Validate email format
        email = data['email'].lower().strip()
        import re
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({'error': 'Invalid email format', 'field': 'email'}), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered', 'field': 'email'}), 409
        
        # Check if username already exists
        existing_username = User.query.filter_by(username=data['username'].strip()).first()
        if existing_username:
            return jsonify({'error': 'Username already taken', 'field': 'username'}), 409
        
        # Create new user with role
        role = data.get('role', 'patient')  # Default to patient if not specified
        if role not in ['patient', 'therapist']:
            role = 'patient'  # Default to patient if invalid role
        
        new_user = User(
            username=data['username'].strip(),
            email=email,
            role=role
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        # Convert user ID to string to ensure compatibility with JWT
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role
            },
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/sessions', methods=['POST'])
@jwt_required()
def create_session():
    try:
        data = request.get_json()
        
        if not data or 'session_type' not in data:
            return jsonify({'error': 'Missing session_type field'}), 400
            
        user_id = get_jwt_identity()
        
        new_session = Session(
            user_id=user_id,
            session_type=data['session_type'],
            duration=data.get('duration'),
            notes=data.get('notes')
        )
        
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify({
            'id': new_session.id,
            'user_id': new_session.user_id,
            'session_type': new_session.session_type,
            'duration': new_session.duration,
            'notes': new_session.notes,
            'created_at': new_session.created_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Missing email or password', 'field': None}), 400
            
        # Find user by email
        user = User.query.filter_by(email=data['email'].lower().strip()).first()
        
        # Check if user exists and password is correct
        if user and user.check_password(data['password']):
            # Get the requested role (patient or therapist)
            requested_role = data.get('role', user.role)  # Use stored role as default
            
            # Validate requested role
            if requested_role not in ['patient', 'therapist']:
                requested_role = user.role  # Fallback to stored role if invalid
            
            # Create access token - convert user ID to string to ensure compatibility with JWT
            access_token = create_access_token(identity=str(user.id))
            
            # Prepare user data - use the validated role
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': requested_role
            }
            
            # Add profile picture URL if available
            if user.profile_picture:
                user_data['profile_picture'] = f'/profile-pictures/{user.profile_picture}'
                
            return jsonify({
                'message': 'Login successful',
                'user': user_data,
                'access_token': access_token
            }), 200
        else:
            return jsonify({'error': 'Invalid email or password', 'field': None}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'An error occurred during login', 'field': None}), 500

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_current_user():
    # Get user ID from JWT token
    user_id = get_jwt_identity()
        
    # Get user info
    user = User.query.get(user_id)
    if user:
        # Use the to_dict method to get consistent user representation
        profile_data = user.to_dict()
        
        # Add profile picture URL if available
        if user.profile_picture:
            profile_data['profile_picture'] = f'/profile-pictures/{user.profile_picture}'
            
        return jsonify(profile_data), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT tokens are stateless - client should discard the token
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get data from form
    data = request.form

    # Update username if provided
    if 'username' in data:
        new_username = data['username']
        if new_username and new_username != user.username:
            # Check if username is already taken
            existing_user = User.query.filter_by(username=new_username).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Username already taken'}), 400
            user.username = new_username
    
    # Handle profile picture upload
    if 'profile_picture' in request.files:
        file = request.files['profile_picture']
        if file and file.filename:
            # Remove old profile picture
            if user.profile_picture:
                old_path = os.path.join(app.config['UPLOAD_FOLDER'], user.profile_picture)
                if os.path.exists(old_path):
                    os.remove(old_path)
            
            # Generate a unique filename
            filename = secure_filename(file.filename)
            file_ext = os.path.splitext(filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            
            # Save the file
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            # Update user profile picture field
            user.profile_picture = unique_filename

    try:
        db.session.commit()

        # Return updated user data
        profile_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }

        # Add profile picture URL if available
        if user.profile_picture:
            profile_data['profile_picture'] = f'/profile-pictures/{user.profile_picture}'

        return jsonify(profile_data), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400



@app.route('/api/users/<int:user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    sessions = Session.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            'id': session.id,
            'session_type': session.session_type,
            'duration': session.duration,
            'notes': session.notes,
            'created_at': session.created_at.isoformat()
        } for session in sessions
    ])

@app.route('/')
def index():
    return jsonify({'message': 'Mindful Verse API is running'})

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        # Check if Gemini models are properly initialized
        if gemini_models is None:
            return jsonify({'error': 'AI service is not properly configured. Please check your API key.'}), 500
            
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Missing message field'}), 400
            
        user_message = data['message']
        print(f"Processing chat request with message: {user_message}")
        
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        # No need to convert to string as it should already be handled correctly
        print(f"User ID from token: {user_id}")
        
        # Generate response using Gemini
        response = generate_response(user_message, gemini_models)
        print(f"Generated response: {response[:50]}..." if response and len(response) > 50 else f"Generated response: {response}")
        
        return jsonify({
            'response': response
        }), 200
        
    except Exception as e:
        print(f"Chat API error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/session-dashboard', methods=['GET', 'POST'])
def get_session_dashboard():
    try:
        # If a session ID is provided, try to use that instead of the default file
        if request.method == 'POST' and request.is_json:
            data = request.get_json()
            if data and 'sessionId' in data:
                # In a real app, we would fetch the session data from a database
                # For now, just return the data if it's from a voice recording session
                if data['sessionId'].startswith('audio-'):
                    # This is a voice recording session, so we should have the data in the request
                    if 'sessionData' in data:
                        return jsonify(data['sessionData'])
        
        # If no session ID is provided or it's not a voice recording session,
        # fall back to the sample file (only for demo purposes)
        json_path = os.path.join(os.path.dirname(__file__), '..', 'session_dashboard_output.json')
        with open(json_path, 'r') as f:
            data = json.loads(f.read())
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Dashboard data not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def analyze_transcript_with_classification_model(structured_transcript):
    """
    Analyze a transcript using the classification model to detect emotions, themes, and distortions
    
    Args:
        structured_transcript: List of dictionaries with 'speaker' and 'utterance' fields
    
    Returns:
        Analysis results including emotions, themes, and distortions
    """
    try:
        # Initialize data structures for analysis
        from collections import defaultdict
        import datetime
        import uuid
        
        # Count patient utterances for timeline indexing
        patient_utterances = [entry for entry in structured_transcript if entry['speaker'] == 'patient']
        patient_count = len(patient_utterances)
        
        # Initialize analysis structures
        emotion_timeline = defaultdict(lambda: [0] * patient_count)
        themes_summary = defaultdict(int)
        distortion_summary = defaultdict(int)
        
        # Process each utterance
        patient_idx = 0
        transcript_with_analysis = []
        
        for i, entry in enumerate(structured_transcript):
            speaker = entry['speaker']
            utterance = entry['utterance']
            
            # Create a new entry with analysis data
            analyzed_entry = {
                "index": i,
                "speaker": speaker,
                "utterance": utterance,
                "emotions": [],
                "themes": [],
                "distortions": []
            }
            
            # Only analyze patient utterances in depth
            if speaker == 'patient':
                # Detect emotions
                emotions = detect_emotions(utterance)
                analyzed_entry["emotions"] = [{"label": emotion, "score": score} for emotion, score in emotions]
                
                for emotion, score in emotions:
                    emotion_timeline[emotion][patient_idx] = score
                
                # Detect themes
                themes = detect_themes(utterance)
                analyzed_entry["themes"] = themes
                for theme in themes:
                    themes_summary[theme] += 1
                
                # Detect cognitive distortions
                distortions = detect_distortions(utterance)
                analyzed_entry["distortions"] = distortions
                for distortion in distortions:
                    distortion_summary[distortion] += 1
                    
                patient_idx += 1
            
            transcript_with_analysis.append(analyzed_entry)
        
        # Create emotion timeline data in the format expected by the frontend
        emotion_timeline_data = []
        for emotion, values in emotion_timeline.items():
            emotion_timeline_data.append({
                "label": emotion,
                "data": values
            })
        
        # Generate a summary from the transcript using Gemini
        try:
            print("Generating summary using Gemini...")
            summary = generate_summary(structured_transcript)
            print(f"Summary generated successfully: {summary[:50]}...")
        except Exception as summary_error:
            print(f"Error generating summary: {str(summary_error)}")
            summary = "Summary generation failed. Please check the Gemini API key and try again."
        
        # Prepare the analysis result in the format expected by TherapistSessions component
        analysis_result = {
            "sessionMeta": {
                "sessionId": f"session-{uuid.uuid4().hex[:8]}",
                "patientId": f"patient-{uuid.uuid4().hex[:8]}",
                "date": datetime.datetime.now().strftime("%Y-%m-%d"),
                "summary": summary
            },
            "transcript": transcript_with_analysis,
            "emotionTimeline": emotion_timeline_data,
            "themesSummary": dict(themes_summary),
            "distortionSummary": dict(distortion_summary)
        }
        
        return analysis_result
    except Exception as e:
        print(f"Error in analyze_transcript_with_classification_model: {str(e)}")
        return {"error": f"Failed to analyze transcript: {str(e)}"}

@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio_endpoint():
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        # Log that we received audio data
        print(f"Received audio data, length: {len(data['audio']) if 'audio' in data else 'unknown'}")
        
        # Check if Gemini models are available
        if gemini_models is None:
            return jsonify({'error': 'Gemini models not initialized properly'}), 500
            
        # Transcribe the audio using Gemini 1.5 Pro
        audio_data = data['audio']
        transcription_result = transcribe_audio_with_gemini(audio_data, gemini_models)
        
        if 'error' in transcription_result:
            print(f"Error in transcription: {transcription_result['error']}")
            return jsonify({'error': transcription_result['error']}), 500
        
        # Get the structured transcript for analysis
        structured_transcript = transcription_result.get('structured_transcript', [])
        
        # Analyze the transcript using the classification model
        analysis_result = analyze_transcript_with_classification_model(structured_transcript)
        
        # We need to ensure the structured_transcript field is included in the response
        # as the VoiceRecorder component specifically checks for this field
        analysis_result['structured_transcript'] = structured_transcript
        
        # Add the raw transcription text if needed
        if 'transcription' in transcription_result and 'transcription' not in analysis_result:
            analysis_result['transcription'] = transcription_result['transcription']
        
        # Log successful transcription and analysis
        print(f"Transcription and analysis successful, returning result")
        print(f"Response includes structured_transcript: {structured_transcript is not None}")
        return jsonify(analysis_result), 200
        
    except Exception as e:
        print(f"Exception in transcribe_audio_endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-transcript', methods=['POST'])
def analyze_transcript():
    try:
        data = request.get_json()
        
        if not data or 'transcript' not in data:
            return jsonify({'error': 'No transcript data provided'}), 400
        
        # Get the transcript data
        transcript_data = data['transcript']
        
        # Check if the transcript is already in structured format
        if isinstance(transcript_data, list) and all(isinstance(item, dict) and 'speaker' in item and 'utterance' in item for item in transcript_data):
            structured_transcript = transcript_data
        else:
            # Try to convert plain text transcript to structured format
            try:
                lines = transcript_data.strip().split('\n')
                structured_transcript = []
                is_therapist = True  # Start with therapist by default
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                        
                    # Check if line starts with speaker label
                    if line.lower().startswith('therapist:'):
                        utterance = line[len('therapist:'):].strip()
                        structured_transcript.append({"speaker": "therapist", "utterance": utterance})
                        is_therapist = False  # Next speaker is patient
                    elif line.lower().startswith('patient:'):
                        utterance = line[len('patient:'):].strip()
                        structured_transcript.append({"speaker": "patient", "utterance": utterance})
                        is_therapist = True  # Next speaker is therapist
                    else:
                        # No speaker label, use alternating speakers
                        speaker = "therapist" if is_therapist else "patient"
                        structured_transcript.append({"speaker": speaker, "utterance": line})
                        is_therapist = not is_therapist  # Toggle speaker
            except Exception as e:
                return jsonify({'error': f'Failed to parse transcript: {str(e)}'}), 400
            
        # Analyze the structured transcript
        analysis_result = analyze_transcript_with_classification_model(structured_transcript)
        
        if 'error' in analysis_result:
            return jsonify({'error': analysis_result['error']}), 500
        
        # Add the raw transcription text if it's not already included
        if 'transcription' not in analysis_result:
            # Format the full transcription with speaker labels
            formatted_transcription = "\n".join([f"{item['speaker'].capitalize()}: {item['utterance']}" for item in structured_transcript])
            analysis_result['transcription'] = formatted_transcription
            
        return jsonify(analysis_result), 200
        
    except Exception as e:
        print(f"Exception in analyze_transcript: {str(e)}")
        return jsonify({'error': str(e)}), 500

# In newer Flask versions, we need to use a different approach instead of before_first_request
# We'll create a function that will be called during app initialization

if __name__ == '__main__':
    # Create tables on startup
    with app.app_context():
        db.create_all()
        
        # Check if we need to create a default admin user
       
    app.run(debug=True, port=5001)