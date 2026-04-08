from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate
from app.api.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    user_service = UserService(db)
    
    if update_data.email and update_data.email != current_user.email:
        existing = await user_service.get_by_email(update_data.email)
        if existing:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Email уже занят")
    
    if update_data.username and update_data.username != current_user.username:
        existing = await user_service.get_by_username(update_data.username)
        if existing:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Имя уже занято")
    
    user = await user_service.update(current_user, update_data)
    return user


@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    user_service = UserService(db)
    users = await user_service.get_all(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    
    return user
