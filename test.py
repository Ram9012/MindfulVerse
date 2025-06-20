# STEP 1: INPUT AND EMOTION CLASSIFICATION
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import json
import matplotlib.pyplot as plt
from collections import defaultdict, Counter

# Load model and tokenizer
model_name = "nateraw/bert-base-uncased-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
labels = ['sadness', 'joy', 'love', 'anger', 'fear', 'surprise']

# Example session data
session_transcript = [
    {"speaker": "patient", "utterance": "I feel like I always mess up."},
    {"speaker": "therapist", "utterance": "What makes you feel that way?"},
    {"speaker": "patient", "utterance": "I'm just tired of everything failing."},
    {"speaker": "patient", "utterance": "Sometimes I do feel hopeful though."},
    {"speaker": "therapist", "utterance": "That's important. What gives you that hope?"},
]

# Emotion detection function
def detect_emotions(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        top_prob, top_label_idx = torch.topk(probs, k=2)
        return [(labels[i], float(top_prob[0][j])) for j, i in enumerate(top_label_idx[0])]

# Apply emotion detection
for entry in session_transcript:
    entry['emotions'] = detect_emotions(entry['utterance'])

# STEP 2: SAVE TO JSON
with open("session_output.json", "w") as f:
    json.dump(session_transcript, f, indent=2)

# STEP 3: PLOT EMOTION TIMELINE
emotion_counts = defaultdict(list)
for i, entry in enumerate(session_transcript):
    for emotion, score in entry['emotions']:
        emotion_counts[emotion].append(score if entry['speaker'] == 'patient' else 0)

for emotion, scores in emotion_counts.items():
    plt.plot(scores, label=emotion)

plt.title("Patient Emotion Timeline")
plt.xlabel("Utterance Index")
plt.ylabel("Emotion Confidence")
plt.legend()
plt.show()

# STEP 4: THEME DETECTION (Keyword Based Example)
theme_keywords = {
    "self-esteem": ["worth", "failure", "mess up", "useless"],
    "hope": ["hope", "better", "progress"],
    "fatigue": ["tired", "exhausted", "drained"]
}

def detect_themes(text):
    themes = []
    for theme, keywords in theme_keywords.items():
        if any(kw in text.lower() for kw in keywords):
            themes.append(theme)
    return themes

for entry in session_transcript:
    entry['themes'] = detect_themes(entry['utterance'])

# STEP 5: COGNITIVE DISTORTION TAGGING (Rule-Based Example)
cognitive_rules = {
    "overgeneralization": ["always", "never"],
    "catastrophizing": ["everything failing", "nothing works"]
}

def detect_distortions(text):
    distortions = []
    for distortion, cues in cognitive_rules.items():
        if any(cue in text.lower() for cue in cues):
            distortions.append(distortion)
    return distortions

for entry in session_transcript:
    entry['distortions'] = detect_distortions(entry['utterance'])


# STEP 6: GEMINI-BASED INSIGHT SUMMARY (Replacing OpenAI)
import requests
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"

summary_prompt = """
Summarize the patient's emotional and thematic journey based on this dialogue:

{}

Give insights that could help a therapist understand the patient's emotional patterns.
""".format(json.dumps(session_transcript, indent=2))

payload = {
    "contents": [
        {
            "parts": [{"text": summary_prompt}]
        }
    ]
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(GEMINI_URL, headers=headers, json=payload)

if response.status_code == 200:
    summary = response.json()["candidates"][0]["content"]["parts"][0]["text"]
    print("\nGemini Insight Summary:\n", summary)
else:
    print("Error:", response.status_code, response.text)
