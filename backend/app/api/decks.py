from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.services.deck_service import DeckService
from app.schemas.deck import DeckCreate, DeckResponse, DeckUpdate
from app.api.dependencies import get_current_active_user
from app.models.user import User
from app.models.deck import Deck

router = APIRouter()


@router.post("/", response_model=DeckResponse, status_code=status.HTTP_201_CREATED)
async def create_deck(
    deck_data: DeckCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.create(current_user.id, deck_data)
    return deck


@router.get("/", response_model=List[DeckResponse])
async def get_user_decks(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    decks = await deck_service.get_user_decks(current_user.id, skip=skip, limit=limit)
    return decks


@router.get("/{deck_id}", response_model=DeckResponse)
async def get_deck(
    deck_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    return deck


@router.put("/{deck_id}", response_model=DeckResponse)
async def update_deck(
    deck_id: int,
    update_data: DeckUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    deck = await deck_service.update(deck, update_data)
    return deck


@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deck(
    deck_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    deck_service = DeckService(db)
    deck = await deck_service.get_by_id(deck_id)
    
    if not deck or deck.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Колода не найдена")
    
    await deck_service.delete(deck)
    return None
