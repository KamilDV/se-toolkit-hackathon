from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate


class FlashcardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, flashcard_id: int) -> Optional[Flashcard]:
        result = await self.db.execute(
            select(Flashcard).where(Flashcard.id == flashcard_id)
        )
        return result.scalar_one_or_none()

    async def get_deck_flashcards(
        self, deck_id: int, skip: int = 0, limit: int = 100
    ) -> List[Flashcard]:
        result = await self.db.execute(
            select(Flashcard)
            .where(Flashcard.deck_id == deck_id)
            .offset(skip)
            .limit(limit)
            .order_by(Flashcard.created_at.desc())
        )
        return result.scalars().all()

    async def create(self, flashcard_data: FlashcardCreate) -> Flashcard:
        flashcard = Flashcard(
            question=flashcard_data.question,
            answer=flashcard_data.answer,
            deck_id=flashcard_data.deck_id,
        )
        self.db.add(flashcard)
        await self.db.flush()
        await self.db.refresh(flashcard)
        return flashcard

    async def create_batch(self, flashcards_data: List[FlashcardCreate]) -> List[Flashcard]:
        flashcards = [
            Flashcard(
                question=fc.question,
                answer=fc.answer,
                deck_id=fc.deck_id,
            )
            for fc in flashcards_data
        ]
        self.db.add_all(flashcards)
        await self.db.flush()
        for fc in flashcards:
            await self.db.refresh(fc)
        return flashcards

    async def update(self, flashcard: Flashcard, update_data: FlashcardUpdate) -> Flashcard:
        update_dict = update_data.model_dump(exclude_unset=True)
        
        for field, value in update_dict.items():
            setattr(flashcard, field, value)
        
        await self.db.flush()
        await self.db.refresh(flashcard)
        return flashcard

    async def delete(self, flashcard: Flashcard) -> None:
        await self.db.delete(flashcard)
        await self.db.flush()

    async def get_unlearned(self, deck_id: int, limit: int = 20) -> List[Flashcard]:
        result = await self.db.execute(
            select(Flashcard)
            .where(Flashcard.deck_id == deck_id, Flashcard.is_learned == False)
            .limit(limit)
        )
        return result.scalars().all()
