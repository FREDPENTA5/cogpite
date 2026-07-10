from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from api.db.client import db

router = APIRouter(prefix="/auth", tags=["auth"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    notificationPrefs: Optional[dict] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

async def get_current_user_id():
    user = await db.user.find_first()
    if user:
        return user.id
    return "mock_user_id"

@router.get("/me")
async def get_profile(user_id: str = Depends(get_current_user_id)):
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't return password hash
    user_dict = user.model_dump()
    if "passwordHash" in user_dict:
        del user_dict["passwordHash"]
    return user_dict

@router.patch("/me")
async def update_profile(data: ProfileUpdate, user_id: str = Depends(get_current_user_id)):
    update_data = data.model_dump(exclude_none=True)
    if update_data:
        user = await db.user.update(
            where={"id": user_id},
            data=update_data
        )
        return user
    return await get_profile(user_id)

@router.patch("/password")
async def change_password(data: PasswordUpdate, user_id: str = Depends(get_current_user_id)):
    # In a real app we would verify current_password and bcrypt hash new_password
    # For now we'll just mock the update
    # new_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    new_hash = f"mock_hash_for_{data.new_password}"
    
    await db.user.update(
        where={"id": user_id},
        data={"passwordHash": new_hash}
    )
    return {"status": "ok"}
