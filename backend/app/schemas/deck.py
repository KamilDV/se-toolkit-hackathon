from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class DeckCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class DeckUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None


class DeckResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    user_id: int
    flashcard_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        data = super().from_orm(obj)
        data.flashcard_count = len(obj.flashcards) if hasattr(obj, 'flashcards') and obj.flashcards else 0
        return data
