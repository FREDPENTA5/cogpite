"""
Routes for managing Supabase tender integration
"""

from fastapi import APIRouter, HTTPException
from api.workers.tender_sync import sync_supabase_tenders, sync_supabase_tenders_async
from api.workers.ppda_sync import sync_ppda_tenders

router = APIRouter(prefix="/tenders", tags=["tenders"])

@router.post("/sync-ppda")
async def trigger_ppda_sync():
    """Trigger async sync of Uganda tenders from PPDA OCDS API."""
    try:
        sync_ppda_tenders.apply_async(queue="scrape_queue")
        return {"status": "queued", "message": "PPDA tender sync queued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync")
async def trigger_tender_sync(country: str | None = None):
    """
    Trigger async sync of tech tenders from Supabase API.
    Falls back to direct sync if Celery is not available.
    If country is None, fetches from ALL countries.
    """
    from api.db.client import db

    country_label = country or "all countries"

    try:
        sync_supabase_tenders.delay(country=country)
        return {
            "status": "queued",
            "message": f"Tender sync queued for {country_label}",
            "country": country_label,
        }
    except Exception:
        # Fallback for local development when Redis/Celery are unavailable.
        try:
            result = await sync_supabase_tenders_async(country=country, queue_extraction=False)
            return {
                "status": "completed",
                "message": f"Tender sync completed directly for {country}",
                "country": country,
                "result": result,
            }
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to start tender sync: {str(exc)}",
            )


@router.get("/sync/status")
async def get_sync_status():
    """
    Get status of recent tender syncs (placeholder)
    """
    return {
        "last_sync": None,
        "status": "idle",
        "message": "No active sync operations"
    }


@router.get("/stats")
async def get_tender_stats():
    """
    Get statistics about imported tenders
    """
    from api.db.client import db

    try:
        pending = await db.rfp.count(where={"status": "PENDING"})
        processing = await db.rfp.count(where={"status": "PROCESSING"})
        complete = await db.rfp.count(where={"status": "COMPLETE"})
        total = pending + processing + complete

        return {
            "total_imported": total,
            "by_status": {
                "pending": pending,
                "processing": processing,
                "complete": complete,
            },
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch stats: {str(e)}",
            "total_imported": 0,
            "by_status": {"pending": 0, "processing": 0, "complete": 0},
        }

