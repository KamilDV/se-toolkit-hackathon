from pydantic import BaseModel, Field
from typing import Optional
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
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
