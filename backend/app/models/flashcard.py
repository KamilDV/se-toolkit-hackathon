from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    deck_id = Column(Integer, ForeignKey("decks.id", ondelete="CASCADE"), nullable=False)
    is_learned = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    deck = relationship("Deck", back_populates="flashcards")

    def __repr__(self):
        return f"<Flashcard {self.question[:50]}>"
