from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader


app = FastAPI(
    title="Student Question API",
    description="A simple FastAPI backend for a React application",
    version="1.0.0",
)


# React runs on port 5173.
# FastAPI runs on port 8000.
# Since these are different origins, CORS permission is required.
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
        answer = "No PDF has been uploaded yet."

    elif cleaned_question.lower() in pdf_text.lower():
        answer = "Found related content in the PDF."

    else:
        answer = "No matching content found in the PDF."

    return QuestionResponse(
        question=cleaned_question,
        answer=answer,
    )