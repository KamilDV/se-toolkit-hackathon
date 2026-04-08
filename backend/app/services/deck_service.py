from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.deck import Deck
from app.schemas.deck import DeckCreate, DeckUpdate


class DeckService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, deck_id: int) -> Optional[Deck]:
        result = await self.db.execute(
            select(Deck)
            .options(selectinload(Deck.flashcards))
            .where(Deck.id == deck_id)
        )
        return result.scalar_one_or_none()

    async def get_user_decks(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Deck]:
        result = await self.db.execute(
            select(Deck)
            .options(selectinload(Deck.flashcards))
            .where(Deck.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Deck.created_at.desc())
        )
        return result.scalars().all()

    async def create(self, user_id: int, deck_data: DeckCreate) -> Deck:
        deck = Deck(
            title=deck_data.title,
            description=deck_data.description,
            user_id=user_id,
        )
        self.db.add(deck)
        await self.db.flush()
        await self.db.refresh(deck)
        return deck

    async def update(self, deck: Deck, update_data: DeckUpdate) -> Deck:
        update_dict = update_data.model_dump(exclude_unset=True)
        
        for field, value in update_dict.items():
            setattr(deck, field, value)
        
        await self.db.flush()
        await self.db.refresh(deck)
        return deck

    async def delete(self, deck: Deck) -> None:
        await self.db.delete(deck)
        await self.db.flush()
