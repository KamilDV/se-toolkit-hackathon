from pydantic import BaseModel, Field
from typing import Optional


class FlashcardGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Текст для генерации карточек")
    num_cards: int = Field(5, ge=1, le=20, description="Количество карточек")
