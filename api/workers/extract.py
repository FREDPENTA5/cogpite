import json
import logging
import os
import time
import hashlib
from celery import Celery
from anthropic import Anthropic
from api.db.client import db

logger = logging.getLogger(__name__)
app = Celery("dealscout", broker=os.environ.get("REDIS_URL", "redis://localhost:6379"))
client = Anthropic()

EXTRACTION_PROMPT = """
You are a procurement analyst. Extract structured data from the RFP text.
Return ONLY valid JSON — no prose, no markdown fences.
Schema:
{
  "title": string,
  "issuing_agency": string | null,
  "country": string | null,
  "region": string | null,
  "published_at": "YYYY-MM-DD" | null,
  "deadline": "YYYY-MM-DD" | null,
  "budget_min": number | null,
  "budget_max": number | null,
  "budget_currency": string,
  "budget_tier": "SMALL"|"MEDIUM"|"LARGE"|"ENTERPRISE"|null,
  "complexity": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
  "summary": string,
  "tech_stack": [string],
  "categories": [string],
  "languages_required": [string],
  "page_count": number | null,
  "confidence_score": float
}

Budget tiers: SMALL <$25k, MEDIUM $25k-$250k, LARGE $250k-$2M, ENTERPRISE >$2M

RFP TEXT:
{rfp_text}
"""

def _rate_limit_check(redis_client, limit: int = 40, window: int = 60):
    """Token bucket: max 40 requests per 60 seconds."""
    key = "dealscout:extract:rate"
    now = time.time()
    pipe = redis_client.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zcard(key)
    pipe.zadd(key, {str(now): now})
    pipe.expire(key, window)
    _, count, _, _ = pipe.execute()
    return count < limit


@app.task(bind=True, max_retries=3, queue="extract_queue")
def extract_rfp(self, rfp_id: str, raw_text: str):
    import asyncio
    import redis

    r = redis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379"))

    if not _rate_limit_check(r):
        raise self.retry(countdown=15)

    try:
        msg = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": EXTRACTION_PROMPT.format(rfp_text=raw_text[:12000]),
            }],
        )
        data = json.loads(msg.content[0].text)

        async def _save():
            await db.connect()
            await db.rfp.update(
                where={"id": rfp_id},
                data={
                    "status": "COMPLETE",
                    "title": data.get("title", "Untitled"),
                    "issuingAgency": data.get("issuing_agency"),
                    "country": data.get("country"),
                    "region": data.get("region"),
                    "deadline": data.get("deadline"),
                    "budgetMin": data.get("budget_min"),
                    "budgetMax": data.get("budget_max"),
                    "budgetCurrency": data.get("budget_currency", "USD"),
                    "budgetTier": data.get("budget_tier"),
                    "complexity": data.get("complexity", "MEDIUM"),
                    "summary": data.get("summary"),
                    "techStack": data.get("tech_stack", []),
                    "categories": data.get("categories", []),
                    "languagesRequired": data.get("languages_required", []),
                    "confidenceScore": data.get("confidence_score"),
                    "extractedJson": data,
                },
            )
            await db.execute_raw('SELECT pg_notify($1, $2)', 'rfp_channel', rfp_id)
            
            # Call match_alerts
            try:
                from api.app.routes.alerts import match_alerts
                await match_alerts(rfp_id, data)
            except Exception as e:
                logger.error(f"Failed to match alerts for RFP {rfp_id}: {e}")
                
            await db.disconnect()

        asyncio.run(_save())
        logger.info(f"Extracted RFP {rfp_id} successfully")

    except json.JSONDecodeError as exc:
        logger.error(f"JSON parse error for RFP {rfp_id}: {exc}")
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))
    except Exception as exc:
        logger.error(f"Extraction failed for RFP {rfp_id}: {exc}")
        if self.request.retries >= 2:
            import asyncio
            async def _fail():
                await db.connect()
                await db.rfp.update(
                    where={"id": rfp_id},
                    data={"status": "FAILED", "processingError": str(exc)},
                )
                await db.disconnect()
            asyncio.run(_fail())
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))
