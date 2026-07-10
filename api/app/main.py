import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.db.client import connect, disconnect
from api.app.routes.rfps import router as rfps_router
from api.app.routes.webhooks import router as webhooks_router
from api.app.routes.billing import router as billing_router
from api.app.routes.meta import router as meta_router
from api.app.routes.alerts import router as alerts_router
from api.app.routes.notifications import router as notifications_router
from api.app.routes.workspace import router as workspace_router
from api.app.routes.ws import router as ws_router
from api.app.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect()
    yield
    await disconnect()


app = FastAPI(title="DealScout AI", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rfps_router)
app.include_router(webhooks_router)
app.include_router(billing_router)
app.include_router(meta_router)
app.include_router(alerts_router)
app.include_router(notifications_router)
app.include_router(workspace_router)
app.include_router(ws_router)
app.include_router(auth_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
