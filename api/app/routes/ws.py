from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import asyncpg
import asyncio
import os
import json

router = APIRouter()
connections: dict[str, list[WebSocket]] = {}

# Mock token validation to return a user-like object with workspaceId
class MockUser:
    workspaceId = "clqzvwxyz0000abcde12345"

async def validate_token(token: str):
    from api.db.client import db
    ws = await db.workspace.find_first()
    user = MockUser()
    if ws:
        user.workspaceId = ws.id
    return user

async def get_latest_notification(workspace_id: str):
    from api.db.client import db
    notifs = await db.notification.find_many(
        where={"workspaceId": workspace_id},
        order={"createdAt": "desc"},
        take=1
    )
    if notifs:
        # Convert to dict, but need to handle datetime serialization
        res = notifs[0].model_dump()
        res["createdAt"] = res["createdAt"].isoformat()
        return res
    return {}

@router.websocket("/ws/notifications")
async def ws_notifications(websocket: WebSocket, token: str = "mock_token"):
    user = await validate_token(token)
    workspace_id = user.workspaceId
    await websocket.accept()
    connections.setdefault(workspace_id, []).append(websocket)
    try:
        conn = await asyncpg.connect(os.environ["DATABASE_URL"])
        async def handle_notify(conn, pid, channel, payload):
            if payload == workspace_id:
                notification = await get_latest_notification(workspace_id)
                for ws in connections.get(workspace_id, []):
                    try:
                        await ws.send_text(json.dumps(notification))
                    except:
                        pass
        await conn.add_listener("notification_channel", handle_notify)
        while True:
            await asyncio.sleep(30)
            await websocket.send_text(json.dumps({"ping": True}))
    except WebSocketDisconnect:
        if workspace_id in connections and websocket in connections[workspace_id]:
            connections[workspace_id].remove(websocket)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        if workspace_id in connections and websocket in connections[workspace_id]:
            connections[workspace_id].remove(websocket)
    finally:
        try:
            await conn.remove_listener("notification_channel", handle_notify)
            await conn.close()
        except:
            pass
