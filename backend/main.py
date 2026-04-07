import os
import json
import logging
from typing import List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Configuration
DATABASE_DIR = "/app/data"
DATABASE_URL = f"sqlite:///{DATABASE_DIR}/flashcards.db"

# Ensure the database directory exists in the container
if not os.path.exists(DATABASE_DIR):
    try:
        os.makedirs(DATABASE_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Could not create database directory: {e}")
        # Fallback to current directory if /app/data is not writable
        DATABASE_URL = "sqlite:///./flashcards.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Flashcard(Base):
    __tablename__ = "flashcards"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)

Base.metadata.create_all(bind=engine)

# OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    text: str

class FlashcardResponse(BaseModel):
    question: str
    answer: str

@app.post("/generate", response_model=List[FlashcardResponse])
async def generate_cards(request: GenerateRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    prompt = (
        "Based on the following study text, generate 3-5 high-quality flashcards "
        "consisting of a question and a concise answer. Format the output as a valid "
        "JSON array of objects, where each object has 'question' and 'answer' keys. "
        "Only output the JSON array.\n\n"
        f"Text: {request.text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        
        content = response.choices[0].message.content.strip()
        # Clean potential markdown formatting
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        
        cards_data = json.loads(content)
        
        db = SessionLocal()
        new_cards = []
        for card in cards_data:
            db_card = Flashcard(question=card["question"], answer=card["answer"])
            db.add(db_card)
            new_cards.append(card)
        
        db.commit()
        db.close()
        
        return new_cards

    except Exception as e:
        logger.error(f"Error generating flashcards: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/flashcards", response_model=List[FlashcardResponse])
async def get_flashcards():
    db = SessionLocal()
    cards = db.query(Flashcard).all()
    db.close()
    return cards

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
