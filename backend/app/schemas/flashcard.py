from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FlashcardCreate(BaseModel):
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
    deck_id: int


class FlashcardUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1)
    answer: Optional[str] = Field(None, min_length=1)
    is_learned: Optional[bool] = None


class FlashcardResponse(BaseModel):
    id: int
    question: str
    answer: str
    deck_id: int
    is_learned: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
