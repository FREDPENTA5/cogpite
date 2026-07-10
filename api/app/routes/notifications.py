from fastapi import APIRouter, Depends
from typing import List
from api.db.client import db
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["notifications"])

async def get_workspace_id():
    ws = await db.workspace.find_first()
    if ws:
        return ws.id
    return "clqzvwxyz0000abcde12345"

@router.get("")
async def list_notifications(workspace_id: str = Depends(get_workspace_id)):
    notifications = await db.notification.find_many(
        where={"workspaceId": workspace_id},
        order={"createdAt": "desc"},
        take=50
    )
    return notifications

@router.patch("/read-all")
async def mark_all_read(workspace_id: str = Depends(get_workspace_id)):
    await db.notification.update_many(
        where={"workspaceId": workspace_id},
        data={"read": True}
    )
    return {"status": "ok"}

@router.patch("/{notif_id}/read")
async def mark_read(notif_id: str, workspace_id: str = Depends(get_workspace_id)):
    await db.notification.update(
        where={"id": notif_id},
        data={"read": True}
    )
    return {"status": "ok"}
