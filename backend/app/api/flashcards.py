from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.services.flashcard_service import FlashcardService
from app.services.deck_service import DeckService
from app.services.ai_service import AIService
from app.schemas.flashcard import FlashcardCreate, FlashcardResponse, FlashcardUpdate
from app.api.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()


class GenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Текст для генерации карточек")
    num_cards: int = Field(5, ge=1, le=20, description="Количество карточек")


@router.post("/", response_model=List[FlashcardResponse], status_code=status.HTTP_201_CREATED)
async def create_flashcard(
    flashcard_data: FlashcardCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(flashcard_data.deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    flashcard_service = FlashcardService(db)
    flashcard = await flashcard_service.create(flashcard_data)
    return [flashcard]


@router.get("/deck/{deck_id}", response_model=List[FlashcardResponse])
async def get_deck_flashcards(
    deck_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    flashcard_service = FlashcardService(db)
    flashcards = await flashcard_service.get_deck_flashcards(deck_id, skip=skip, limit=limit)
    return flashcards


@router.get("/unlearned/{deck_id}", response_model=List[FlashcardResponse])
async def get_unlearned_flashcards(
    deck_id: int,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    flashcard_service = FlashcardService(db)
    flashcards = await flashcard_service.get_unlearned(deck_id, limit=limit)
    return flashcards


@router.get("/{flashcard_id}", response_model=FlashcardResponse)
async def get_flashcard(
    flashcard_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    flashcard_service = FlashcardService(db)
    flashcard = await flashcard_service.get_by_id(flashcard_id)
    
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(flashcard.deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    return flashcard


@router.put("/{flashcard_id}", response_model=FlashcardResponse)
async def update_flashcard(
    flashcard_id: int,
    update_data: FlashcardUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    flashcard_service = FlashcardService(db)
    flashcard = await flashcard_service.get_by_id(flashcard_id)
    
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(flashcard.deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    flashcard = await flashcard_service.update(flashcard, update_data)
    return flashcard


@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_flashcard(
    flashcard_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    flashcard_service = FlashcardService(db)
    flashcard = await flashcard_service.get_by_id(flashcard_id)
    
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(flashcard.deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Карточка не найдена")
    
    await flashcard_service.delete(flashcard)
    return None


@router.post("/generate/{deck_id}", response_model=List[FlashcardResponse], status_code=status.HTTP_201_CREATED)
async def generate_flashcards(
    deck_id: int,
    request_body: "GenerateRequest",
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    text = request_body.text
    num_cards = request_body.num_cards
    
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    ai_service = AIService()
    cards_data = await ai_service.generate_flashcards(text, num_cards)
    
    flashcard_service = FlashcardService(db)
    flashcards_to_create = [
        FlashcardCreate(
            question=card["question"],
            answer=card["answer"],
            deck_id=deck_id,
        )
        for card in cards_data
    ]
    
    flashcards = await flashcard_service.create_batch(flashcards_to_create)
    return flashcards
