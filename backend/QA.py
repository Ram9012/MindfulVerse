import os
import fitz  # PyMuPDF
import faiss
import google.generativeai as genai
from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

# Load embedding model (local)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

PDF_PATH = "test.pdf"


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


def main(pdf_path: str, query: str):
    print("[1] Extracting text...")
    full_text = extract_text_from_pdf(pdf_path)

    print("[2] Chunking text...")
    chunks = chunk_text(full_text)

    print("[3] Generating embeddings...")
    vectors = embed_chunks(chunks)

    print("[4] Creating FAISS index...")
    index = create_faiss_index(vectors)

    print("[5] Retrieving relevant chunks...")
    top_chunks = retrieve_relevant_chunks(index, query, chunks)

    print("[6] Generating answer using Gemini...")
    context = "\n".join(top_chunks)
    answer = answer_with_gemini(query, context)
    print("\nAnswer:\n", answer)


if __name__ == "__main__":
    USER_QUERY = input("Enter question:")
    main(PDF_PATH, USER_QUERY)
