from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader
import re


app = FastAPI(
    title="Student Question API",
    description="A simple FastAPI backend for a React application",
    version="1.0.0",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Stores the extracted text from the uploaded PDF
pdf_text = ""


class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    question: str
    answer: str


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global pdf_text

    reader = PdfReader(file.file)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    pdf_text = text

    return {
        "message": "PDF uploaded successfully"
    }


@app.get("/")
def home():
    return {
        "message": "FastAPI backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/ask", response_model=QuestionResponse)
def ask_question(request: QuestionRequest):

    cleaned_question = request.question.strip()

    if not cleaned_question:
        return QuestionResponse(
            question="",
            answer="Please enter a question.",
        )

    if pdf_text == "":
        return QuestionResponse(
            question=cleaned_question,
            answer="No PDF has been uploaded yet.",
        )

    # Convert PDF text and question to lowercase
    pdf_lower = pdf_text.lower()
    question_lower = cleaned_question.lower()

    # Remove punctuation from the question
    words = re.findall(r"\b[a-zA-Z0-9]+\b", question_lower)

    # Remove common words that don't help with searching
    stop_words = {
        "what", "is", "are", "the", "a", "an",
        "of", "in", "on", "to", "for", "and",
        "how", "why", "does", "do", "can",
        "you", "explain", "tell", "me", "about"
    }

    keywords = [
        word for word in words
        if word not in stop_words and len(word) > 2
    ]

    # Find sentences containing question keywords
    sentences = re.split(r'(?<=[.!?])\s+', pdf_text)

    matching_sentences = []

    for sentence in sentences:

        sentence_lower = sentence.lower()

        score = 0

        for keyword in keywords:
            if keyword in sentence_lower:
                score += 1

        if score > 0:
            matching_sentences.append((score, sentence.strip()))

    # Sort by relevance
    matching_sentences.sort(
        key=lambda item: item[0],
        reverse=True
    )

    if matching_sentences:

        best_matches = [
            sentence
            for score, sentence in matching_sentences[:3]
        ]

        answer = " ".join(best_matches)

    else:

        answer = "No relevant content found in the PDF."


    return QuestionResponse(
        question=cleaned_question,
        answer=answer,
    )