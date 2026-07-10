from fastapi import APIRouter, Depends, Query
from api.app.middleware.auth import get_current_user
from api.db import RLS

router = APIRouter(prefix="/rfps", tags=["rfps"])


@router.get("")
async def list_rfps(
    budget_tier: str | None = Query(default=None),
    complexity: str | None = Query(default=None),
    deadline_before: str | None = Query(default=None),
    q: str | None = Query(default=None),
    cursor: str | None = Query(default=None),
    user=Depends(get_current_user),
):
    rfps = await RLS.list_rfps(
        workspace_id=user.workspaceId,
        budget_tier=budget_tier,
        complexity=complexity,
        deadline_before=deadline_before,
        q=q,
        cursor=cursor,
    )
    next_cursor = rfps[-1].id if len(rfps) == 20 else None
    return {"data": rfps, "nextCursor": next_cursor}


@router.get("/{rfp_id}")
async def get_rfp(rfp_id: str, user=Depends(get_current_user)):
    rfp = await RLS.get_rfp(rfp_id)
    if not rfp:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="RFP not found")
    return rfp


@router.post("/{rfp_id}/save")
async def save_rfp(rfp_id: str, user=Depends(get_current_user)):
    return await RLS.toggle_save(rfp_id, user.workspaceId, user.id)


@router.get("/saved/list")
async def list_saved(user=Depends(get_current_user)):
    return await RLS.list_saved(user.workspaceId)
