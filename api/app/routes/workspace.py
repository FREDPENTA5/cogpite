from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Optional
from api.db.client import db
from pydantic import BaseModel

router = APIRouter(prefix="/workspace", tags=["workspace"])

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None

class InviteMember(BaseModel):
    email: str
    role: str

async def get_workspace_id():
    ws = await db.workspace.find_first()
    if ws:
        return ws.id
    return "clqzvwxyz0000abcde12345"

@router.get("")
async def get_workspace(workspace_id: str = Depends(get_workspace_id)):
    ws = await db.workspace.find_unique(where={"id": workspace_id})
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

@router.patch("")
async def update_workspace(data: WorkspaceUpdate, workspace_id: str = Depends(get_workspace_id)):
    update_data = data.model_dump(exclude_none=True)
    if update_data:
        ws = await db.workspace.update(
            where={"id": workspace_id},
            data=update_data
        )
        return ws
    return await get_workspace(workspace_id)

@router.get("/members")
async def list_members(workspace_id: str = Depends(get_workspace_id)):
    members = await db.user.find_many(
        where={"workspaceId": workspace_id}
    )
    return members

@router.post("/invite")
async def invite_member(data: InviteMember, workspace_id: str = Depends(get_workspace_id)):
    # Very basic mock: just create a user with that email
    try:
        user = await db.user.create(
            data={
                "email": data.email,
                "role": data.role,
                "workspaceId": workspace_id,
                "name": data.email.split("@")[0]
            }
        )
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/members/{user_id}")
async def remove_member(user_id: str, workspace_id: str = Depends(get_workspace_id)):
    await db.user.delete(
        where={"id": user_id}
    )
    return {"status": "ok"}
