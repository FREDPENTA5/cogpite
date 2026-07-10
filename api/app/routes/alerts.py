from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from api.db.client import db

router = APIRouter(prefix="/alerts", tags=["alerts"])

class AlertFilters(BaseModel):
    budgetTier: Optional[List[str]] = None
    complexity: Optional[List[str]] = None
    country: Optional[str] = None
    techStack: Optional[List[str]] = None
    categories: Optional[List[str]] = None

class AlertCreate(BaseModel):
    name: str
    filters: AlertFilters

async def get_workspace_id():
    ws = await db.workspace.find_first()
    if ws:
        return ws.id
    return "clqzvwxyz0000abcde12345"

@router.get("")
async def list_alerts(workspace_id: str = Depends(get_workspace_id)):
    alerts = await db.alert.find_many(
        where={"workspaceId": workspace_id},
        order={"createdAt": "desc"}
    )
    result = []
    for alert in alerts:
        filters = alert.filters
        if isinstance(filters, str):
            import json
            filters = json.loads(filters)
            
        count = await db.notification.count(
            where={"alertId": alert.id}
        )
        
        alert_dict = alert.model_dump()
        alert_dict["recent_matches"] = count
        result.append(alert_dict)
        
    return result

@router.post("")
async def create_alert(
    alert_data: AlertCreate, 
    workspace_id: str = Depends(get_workspace_id)
):
    alert = await db.alert.create(
        data={
            "workspaceId": workspace_id,
            "name": alert_data.name,
            "filters": alert_data.filters.model_dump(exclude_none=True)
        }
    )
    return alert

@router.patch("/{alert_id}/toggle")
async def toggle_alert(
    alert_id: str, 
    active: bool = Body(..., embed=True),
    workspace_id: str = Depends(get_workspace_id)
):
    return {"status": "ok", "active": active}

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: str,
    workspace_id: str = Depends(get_workspace_id)
):
    await db.alert.delete(where={"id": alert_id})
    return {"status": "ok"}

async def match_alerts(rfp_id: str, rfp_data: dict):
    alerts = await db.alert.find_many()
    
    for alert in alerts:
        f = alert.filters
        if isinstance(f, str):
            import json
            f = json.loads(f)
            
        match = True
        
        if f.get("budgetTier") and rfp_data.get("budget_tier") not in f["budgetTier"]:
            match = False
        if f.get("complexity") and rfp_data.get("complexity") not in f["complexity"]:
            match = False
        if f.get("country") and rfp_data.get("country") != f["country"]:
            match = False
        if f.get("techStack"):
            if not any(t in rfp_data.get("tech_stack", []) for t in f["techStack"]):
                match = False
        if f.get("categories"):
            if not any(c in rfp_data.get("categories", []) for c in f["categories"]):
                match = False
                
        if match:
            title = rfp_data.get("title", "")
            await db.notification.create(
                data={
                    "workspaceId": alert.workspaceId,
                    "alertId": alert.id,
                    "rfpId": rfp_id,
                    "title": f"New match: {alert.name}",
                    "body": title if title else "New RFP matched your alert criteria."
                }
            )
            await db.query_raw(
                "SELECT pg_notify($1, $2)",
                "notification_channel",
                alert.workspaceId
            )
