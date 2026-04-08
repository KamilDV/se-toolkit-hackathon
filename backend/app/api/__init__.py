from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .decks import router as decks_router
from .flashcards import router as flashcards_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(decks_router, prefix="/decks", tags=["Decks"])
api_router.include_router(flashcards_router, prefix="/flashcards", tags=["Flashcards"])

__all__ = ["api_router"]
