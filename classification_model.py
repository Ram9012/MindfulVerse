# STEP 1: INPUT AND EMOTION CLASSIFICATION
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import json
from collections import defaultdict
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load model and tokenizer
model_name = "nateraw/bert-base-uncased-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
labels = ['sadness', 'joy', 'love', 'anger', 'fear', 'surprise']

# Example session data for testing
session_transcript = [
    {"speaker": "patient", "utterance": "I feel like I always mess up."},
    {"speaker": "therapist", "utterance": "What makes you feel that way?"},
    {"speaker": "patient", "utterance": "I'm just tired of everything failing."},
    {"speaker": "patient", "utterance": "Sometimes I do feel hopeful though."},
    {"speaker": "therapist", "utterance": "That's important. What gives you that hope?"}
]

# Emotion detection function
def detect_emotions(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        top_probs, top_label_idx = torch.topk(probs, k=2)
        return [(labels[i], float(top_probs[0][j])) for j, i in enumerate(top_label_idx[0])]

# Theme and distortion rules
theme_keywords = {
    "self-esteem": ["worth", "failure", "mess up", "useless"],
    "hope": ["hope", "better", "progress"],
    "fatigue": ["tired", "exhausted", "drained"]
}

cognitive_rules = {
    "overgeneralization": ["always", "never"],
    "catastrophizing": ["everything failing", "nothing works"]
}

def detect_themes(text):
    return [theme for theme, keywords in theme_keywords.items() if any(kw in text.lower() for kw in keywords)]

def detect_distortions(text):
    return [distortion for distortion, cues in cognitive_rules.items() if any(cue in text.lower() for cue in cues)]

# Function to generate summary via Gemini
def generate_summary(structured_transcript):
    # Get API key from environment variable    
    if not API_KEY:
        print("Warning: No Gemini API key found in environment variables.")
        return "Summary could not be generated. Please set the GEMINI_API_KEY environment variable."
    
    API_KEY = os.getenv("API_KEY")
    GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"
    summary_prompt = f"""
    Summarize the patient's emotional and thematic journey based on this dialogue:
    
    {json.dumps(structured_transcript, indent=2)}
    
    Give insights that could help a therapist understand the patient's emotional patterns.
    Provide Time Series Insights on the patient's emotional journey.
    Provide tips/ways to help the patient improve their emotional state.
    """
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": summary_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.8,
            "topK": 40,
            "maxOutputTokens": 1024
        }
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            response_data = response.json()
            # Check if the response has the expected structure
            if "candidates" in response_data and response_data["candidates"] and "content" in response_data["candidates"][0]:
                return response_data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                # Try alternative response format
                if "error" in response_data:
                    return f"Summary could not be generated. API error: {response_data['error'].get('message', 'Unknown error')}"
                else:
                    # Attempt to extract text from different response structure
                    try:
                        # Some Gemini API versions use different response structures
                        if "generations" in response_data:
                            return response_data["generations"][0]["text"]
                        else:
                            return "Summary could not be generated. Please check the Gemini API key or input."
                    except:
                        return "Summary could not be generated. Please check the Gemini API key or input."
        else:
            return f"Summary could not be generated. API status code: {response.status_code}"
    except requests.exceptions.ConnectionError:
        print("Connection error when trying to reach Gemini API. Check your internet connection.")
        return "Summary could not be generated. Connection error when trying to reach Gemini API."
    except requests.exceptions.Timeout:
        print("Timeout error when trying to reach Gemini API.")
        return "Summary could not be generated. Timeout error when trying to reach Gemini API."
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return f"Summary could not be generated. Error: {str(e)}"

# Process the example data (only for demonstration)
def process_example_data():
    # Initialize timeline data
    emotion_timeline = defaultdict(lambda: [0] * sum(1 for entry in session_transcript if entry['speaker'] == 'patient'))
    themes_summary = defaultdict(int)
    distortion_summary = defaultdict(int)
    structured_transcript = []
    
    patient_idx = 0  # Track patient-only index for plotting
    
    # Analyze session
    for idx, entry in enumerate(session_transcript):
        utterance = entry["utterance"]
        speaker = entry["speaker"]
        emotions = detect_emotions(utterance) if speaker == "patient" else []
        themes = detect_themes(utterance) if speaker == "patient" else []
        distortions = detect_distortions(utterance) if speaker == "patient" else []
    
        # Update timeline
        if speaker == "patient":
            for label, score in emotions:
                emotion_timeline[label][patient_idx] = score
            for theme in themes:
                themes_summary[theme] += 1
            for distortion in distortions:
                distortion_summary[distortion] += 1
            patient_idx += 1
    
        structured_transcript.append({
            "index": idx,
            "speaker": speaker,
            "utterance": utterance,
            "emotions": [{"label": e[0], "score": e[1]} for e in emotions],
            "themes": themes,
            "distortions": distortions
        })
    
    # Generate summary safely (only if explicitly requested)
    gemini_summary = "Summary will be generated when analyze_transcript is called."
    
    # Final JSON structure for dashboard
    dashboard_output = {
        "sessionMeta": {
            "sessionId": "abc123",
            "patientId": "patient001",
            "date": "2025-05-01",
            "summary": gemini_summary
        },
        "transcript": structured_transcript,
        "emotionTimeline": [
            {"label": label, "data": scores}
            for label, scores in emotion_timeline.items()
        ],
        "themesSummary": dict(themes_summary),
        "distortionSummary": dict(distortion_summary)
    }
    
    # Save output
    with open("session_dashboard_output.json", "w") as f:
        json.dump(dashboard_output, f, indent=2)
    
    print("✅ Dashboard JSON generated: session_dashboard_output.json")

# Only run the example processing if this file is executed directly
if __name__ == "__main__":
    process_example_data()
