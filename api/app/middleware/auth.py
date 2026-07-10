import os
from datetime import datetime, timezone
from fastapi import Cookie, Header, HTTPException, Depends
from api.db.client import db
import uuid

# Mock user for local development
class MockUser:
    id = "user_123"
    workspaceId = "workspace_123"
    email = "test@example.com"
    name = "Test User"
    
async def get_current_user(
    authorization: str | None = Header(default=None),
    session_token: str | None = Cookie(default=None),
):
    # BYPASS AUTH FOR LOCAL DEV
    # Ensure the dummy workspace and user exist in DB so foreign keys don't fail for save_rfp
    workspace = await db.workspace.upsert(
        where={"slug": "default-workspace"},
        data={
            "create": {"id": "workspace_123", "name": "Default Workspace", "slug": "default-workspace"},
            "update": {}
        }
    )
    user = await db.user.upsert(
        where={"email": "test@example.com"},
        data={
            "create": {"id": "user_123", "email": "test@example.com", "name": "Test User", "workspaceId": workspace.id},
            "update": {}
        }
    )
    return user

