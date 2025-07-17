from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF
import faiss
import google.generativeai as genai
from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
# Configure CORS with all options enabled
CORS(app, 
     resources={r"/*": {
         "origins": "*",
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
         "supports_credentials": True
     }})

# Add a before_request handler to handle OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        return response

# Configure Gemini
load_dotenv()
GEMINI_API_KEY=os.getenv("API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

# Load embedding model (local)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Dictionary to store document data
documents = {}

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def chunk_text(text: str, max_tokens: int = 300) -> List[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_tokens):
        chunk = " ".join(words[i:i + max_tokens])
        chunks.append(chunk)
    return chunks

def embed_chunks(chunks: List[str]) -> np.ndarray:
    return embedding_model.encode(chunks, convert_to_numpy=True)

def create_faiss_index(vectors: np.ndarray):
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)
    return index

def retrieve_relevant_chunks(index, query: str, chunks: List[str], k: int = 3):
    query_vec = embedding_model.encode([query])
    D, I = index.search(np.array(query_vec), k)
    return [chunks[i] for i in I[0]]

def answer_with_gemini(query: str, context: str) -> str:
    prompt = f"""
You're a helpful assistant. Use the following context to answer the user's question:

Context:
{context}

Question:
{query}

Answer:
"""
    response = model.generate_content(prompt)
    return response.text.strip()

@app.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    print("Received upload request")
    if 'pdf' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['pdf']
    
    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Save the file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        print(f"File saved to {filepath}")
        
        # Process the PDF
        try:
            print(f"[1] Extracting text from {file.filename}...")
            full_text = extract_text_from_pdf(filepath)
            
            print("[2] Chunking text...")
            chunks = chunk_text(full_text)
            
            print("[3] Generating embeddings...")
            vectors = embed_chunks(chunks)
            
            print("[4] Creating FAISS index...")
            index = create_faiss_index(vectors)
            
            # Store document data for later use
            documents[file.filename] = {
                'chunks': chunks,
                'index': index,
                'filepath': filepath
            }
            
            return jsonify({
                'message': 'PDF uploaded and processed successfully',
                'filename': file.filename
            }), 200
            
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    print("Invalid file type")
    return jsonify({'error': 'Invalid file type. Please upload a PDF.'}), 400

@app.route('/api/ask-question', methods=['POST'])
def ask_question():
    data = request.json
    
    if not data or 'question' not in data or 'pdf_name' not in data:
        return jsonify({'error': 'Missing question or PDF name'}), 400
    
    question = data['question']
    pdf_name = data['pdf_name']
    
    if pdf_name not in documents:
        return jsonify({'error': 'PDF not found. Please upload it first.'}), 404
    
    try:
        # Retrieve document data
        doc_data = documents[pdf_name]
        
        print("[5] Retrieving relevant chunks...")
        top_chunks = retrieve_relevant_chunks(doc_data['index'], question, doc_data['chunks'])
        
        print("[6] Generating answer using Gemini...")
        context = "\n".join(top_chunks)
        answer = answer_with_gemini(question, context)
        
        return jsonify({'answer': answer}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
