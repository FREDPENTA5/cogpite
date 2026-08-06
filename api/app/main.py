import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import DB client lazily inside lifespan to avoid startup failure when prisma client isn't generated yet
from api.app.routes.rfps import router as rfps_router
from api.app.routes.webhooks import router as webhooks_router
from api.app.routes.billing import router as billing_router
from api.app.routes.meta import router as meta_router
from api.app.routes.alerts import router as alerts_router
from api.app.routes.notifications import router as notifications_router
from api.app.routes.workspace import router as workspace_router
from api.app.routes.ws import router as ws_router
from api.app.routes.auth import router as auth_router
from api.app.routes.tenders import router as tenders_router


def load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return

    for line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = line.lstrip("\ufeff").strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


dotenv_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Lazy import the DB client so the app can start even if prisma client hasn't been generated yet.
    try:
        from importlib import import_module
        db_module = import_module('api.db.client')
        await db_module.connect()
    except Exception as e:
        # If the prisma client isn't generated or DB connection fails at startup, log and continue.
        print(f"Warning: DB client not available at startup: {e}")
        db_module = None

    try:
        yield
    finally:
        if db_module is not None:
            try:
                await db_module.disconnect()
            except Exception:
                pass


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
app.include_router(tenders_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
