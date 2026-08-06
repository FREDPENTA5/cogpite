"""Fallback scheduler for direct tender sync without Redis/Celery.

This scheduler runs a direct Supabase tender sync on the same
schedule as the original Celery Beat config:
- daily at 2 AM UTC
- every 6 hours

It uses the same async sync logic from api.workers.tender_sync,
but skips work queue dispatch if Redis is unavailable.
"""

import asyncio
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path


def load_env():
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        raise FileNotFoundError(f".env file not found at {env_path}")

    for line in env_path.read_text().splitlines():
        line = line.lstrip("\ufeff").strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def get_next_run(now: datetime) -> datetime:
    schedule_hours = [2, 8, 14, 20]
    for hour in schedule_hours:
        candidate = now.replace(hour=hour, minute=0, second=0, microsecond=0)
        if candidate > now:
            return candidate
    return now.replace(hour=2, minute=0, second=0, microsecond=0) + timedelta(days=1)


async def sync_once():
    from api.workers.tender_sync import sync_supabase_tenders_async

    now = datetime.now(timezone.utc)
    print(f"[{now.isoformat()}] Starting direct Supabase tender sync")
    try:
        result = await sync_supabase_tenders_async("Uganda", queue_extraction=False)
        now = datetime.now(timezone.utc)
        print(f"[{now.isoformat()}] Sync result: {result}")
    except Exception as exc:
        now = datetime.now(timezone.utc)
        print(f"[{now.isoformat()}] Sync failed: {exc}")


async def run_scheduler():
    load_env()

    # Run once immediately on startup so the app gets fresh tenders.
    await sync_once()

    while True:
        now = datetime.now(timezone.utc)
        next_run = get_next_run(now)
        wait_seconds = (next_run - now).total_seconds()
        print(
            f"[{now.isoformat()}] Next scheduled sync at {next_run.isoformat()} UTC (in {int(wait_seconds)} seconds)"
        )
        await asyncio.sleep(wait_seconds)
        await sync_once()


if __name__ == "__main__":
    asyncio.run(run_scheduler())
