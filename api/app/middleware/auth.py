import os
from datetime import datetime, timezone
from fastapi import Cookie, Header, HTTPException, Depends
# Import DB client lazily inside functions to tolerate missing prisma client during startup
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
    # Try to use DB if available; otherwise return a mock user to allow the app to run.
    try:
        from api.db.client import db
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
    except Exception:
        # If DB isn't ready or prisma client isn't generated, return a mock user for local dev.
        return MockUser()

