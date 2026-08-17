"""
Supabase Tender API Integration Worker
Fetches tech-related tenders and syncs them to dealscout database
Supports Tor network routing for privacy
"""

import hashlib
import json
import logging
import os
import asyncio
import httpx
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from celery import Celery
from api.db.client import db
from api.workers.extract import extract_rfp


def load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return

    for line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = line.lstrip("\ufeff").strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


load_dotenv(Path(__file__).resolve().parents[2] / ".env")

logger = logging.getLogger(__name__)
app = Celery("dealscout", broker=os.environ.get("REDIS_URL", "redis://localhost:6379"))
app.conf.worker_redirect_stdouts = False

# Supabase API Configuration
SUPABASE_BASE_URL = "https://rtessqlvvsjecogctwok.supabase.co/rest/v1/tenders"
SUPABASE_API_KEY = os.environ.get("SUPABASE_API_KEY", "")
SUPABASE_AUTH_TOKEN = os.environ.get("SUPABASE_AUTH_TOKEN", "")

# Tor Configuration
USE_TOR = os.environ.get("USE_TOR", "false").lower() == "true"
TOR_PROXY_URL = os.environ.get("TOR_PROXY_URL", "socks5://127.0.0.1:9050")

# Tech-related keywords to filter tenders
TECH_KEYWORDS = [
    "software", "it services", "technology", "developer", "programmer",
    "database", "cloud", "infrastructure", "devops", "automation",
    "ai", "artificial intelligence", "machine learning", "data science", 
    "web", "api", "mobile", "application", "system", "digital",
    "cyber security", "it support", "ict", "telecommunications",
    "blockchain", "saas", "platform", "network", "server"
]


def is_tech_related(tender: dict) -> bool:
    """Check if tender is tech-related based on title, summary, and sector"""
    searchable = " ".join([
        str(tender.get("title", "")).lower(),
        str(tender.get("summary", "")).lower(),
        str(tender.get("sector", "")).lower(),
        str(tender.get("agpo_category", "")).lower(),
    ])
    return any(keyword in searchable for keyword in TECH_KEYWORDS)


def parse_budget(value: str, currency: str = "USD") -> tuple[Decimal | None, Decimal | None]:
    """Extract budget value and convert to min/max format"""
    if not value:
        return None, None
    
    try:
        clean_value = value.replace("$", "").replace("£", "").replace("€", "").strip()
        numeric = ''.join(c for c in clean_value if c.isdigit() or c == '.')
        if numeric:
            amount = Decimal(numeric)
            return amount, amount
    except (ValueError, TypeError):
        pass
    return None, None


def map_tender_to_rfp(tender: dict) -> dict:
    """Map Supabase tender fields to RFP model"""
    source_url = f"https://tenderflow.co.ke/tender/{tender.get('id', 'unknown')}"
    source_hash = hashlib.sha256(source_url.encode()).hexdigest()
    
    budget_min, budget_max = parse_budget(
        str(tender.get("value", "")),
        tender.get("currency", "USD")
    )
    
    published_at = None
    if tender.get("published_at"):
        try:
            published_at = datetime.fromisoformat(
                tender["published_at"].replace("Z", "+00:00")
            )
        except (ValueError, TypeError):
            pass
    
    deadline = None
    if tender.get("closes_at"):
        try:
            deadline = datetime.fromisoformat(
                tender["closes_at"].replace("Z", "+00:00")
            )
        except (ValueError, TypeError):
            pass
    
    summary = str(tender.get("summary", ""))[:2000]
    categories = [
        str(value).strip()
        for value in [tender.get("sector"), tender.get("agpo_category")]
        if value is not None and str(value).strip()
    ]
    
    raw_text = f"""
Tender ID: {tender.get('ref_no', 'N/A')}
Title: {tender.get('title', 'N/A')}
Issuer: {tender.get('issuer', 'N/A')}
Sector: {tender.get('sector', 'N/A')}
Category: {tender.get('agpo_category', 'N/A')}

Summary:
{summary}

Budget: {tender.get('value', 'N/A')} {tender.get('currency', 'USD')}
Bid Security: {tender.get('bid_security', 'N/A')}
Deadline: {tender.get('closes_at', 'N/A')}
Source: {tender.get('source', 'N/A')}
"""
    
    return {
        "sourceUrl": source_url,
        "sourceHash": source_hash,
        "title": str(tender.get("title", "Unknown Tender"))[:200],
        "issuingAgency": str(tender.get("issuer", "Unknown"))[:200],
        "country": str(tender.get("country", "Unknown"))[:100],
        "region": str(tender.get("region", ""))[:100] or None,
        "publishedAt": published_at,
        "deadline": deadline,
        "budgetMin": budget_min,
        "budgetMax": budget_max,
        "budgetCurrency": str(tender.get("currency", "USD")),
        "summary": summary,
        "rawText": raw_text,
        "techStack": [],
        "categories": categories,
        "languagesRequired": [],
        "status": "COMPLETE",
        "confidenceScore": 0.0,
        "budgetTier": None,
        "extractedJson": json.dumps({
            "source": "supabase",
            "ref_no": tender.get("ref_no"),
            "bid_security": tender.get("bid_security"),
            "download_count": tender.get("download_count", 0),
            "issuer_rating": tender.get("issuer_rating"),
            "original_id": tender.get("id"),
        })
    }


async def _fetch_page(client: httpx.AsyncClient, headers: dict, params: dict) -> list[dict]:
    """Fetch a single page from Supabase, handling 401 fallback."""
    resp = await client.get(SUPABASE_BASE_URL, headers=headers, params=params)
    if resp.status_code == 401 and "Authorization" in headers:
        logger.warning("Auth token expired/invalid. Retrying anonymous fetch...")
        headers_anon = {k: v for k, v in headers.items() if k != "Authorization"}
        resp = await client.get(SUPABASE_BASE_URL, headers=headers_anon, params=params)
    resp.raise_for_status()
    return resp.json()


async def fetch_tenders_with_tor(country: str = "Uganda", limit: int = 500) -> list[dict]:
    """
    Fetch ALL tenders via Tor or direct connection.
    Paginates through the Supabase endpoint in pages of `limit`.
    If country is None, fetches tenders from all countries.
    """
    headers = {
        "accept": "application/json",
        "accept-profile": "public",
    }

    if SUPABASE_API_KEY and "placeholder" not in SUPABASE_API_KEY.lower():
        headers["apikey"] = SUPABASE_API_KEY

    if SUPABASE_AUTH_TOKEN and "placeholder" not in SUPABASE_AUTH_TOKEN.lower():
        headers["Authorization"] = f"Bearer {SUPABASE_AUTH_TOKEN}"

    base_params = {
        "status": "in.(published,archived)",
        "order": "created_at.desc",
        "select": "id,title,issuer,country,region,source,sector,value,currency,published_at,closes_at,ref_no,summary,status,bid_security,issuer_rating,issuer_logo_url,agpo_category,download_count,created_at,archived_at",
    }
    if country:
        base_params["country"] = f"eq.{country}"

    all_tenders = []
    offset = 0

    try:
        proxy = TOR_PROXY_URL if USE_TOR else None
        timeout = 60 if USE_TOR else 30
        label = f"via Tor: {TOR_PROXY_URL}" if USE_TOR else "via direct connection"
        logger.info(f"Fetching tenders {label}")

        async with httpx.AsyncClient(timeout=timeout, proxy=proxy) as client:
            while True:
                params = {**base_params, "limit": limit, "offset": offset}
                page = await _fetch_page(client, headers, params)
                if not page:
                    break
                all_tenders.extend(page)
                logger.info(f"  Page at offset={offset}: got {len(page)} tenders")
                if len(page) < limit:
                    break  # last page
                offset += limit

        tech_tenders = [t for t in all_tenders if is_tech_related(t)]
        logger.info(
            f"Fetched {len(all_tenders)} total tenders, {len(tech_tenders)} are tech-related"
        )
        return tech_tenders
    except httpx.HTTPError as e:
        logger.error(f"Failed to fetch tenders: {e}")
        raise


async def trigger_alerts(rfp_id: str, rfp_data: dict):
    """Check if new RFP triggers any alerts and send notifications"""
    try:
        # Find all alerts in the workspace
        from api.db.client import db
        
        alerts = await db.alert.find_many()
        
        for alert in alerts:
            # Simple filter matching - can be expanded
            filters = alert.filters or {}
            
            # Check budget filter
            if "minBudget" in filters and rfp_data.get("budgetMin"):
                if rfp_data["budgetMin"] < Decimal(str(filters["minBudget"])):
                    continue
            
            if "maxBudget" in filters and rfp_data.get("budgetMax"):
                if rfp_data["budgetMax"] > Decimal(str(filters["maxBudget"])):
                    continue
            
            # Check complexity filter
            if "complexity" in filters and rfp_data.get("complexity"):
                if rfp_data["complexity"] != filters["complexity"]:
                    continue
            
            # Create notification
            await db.notification.create(data={
                "workspaceId": alert.workspaceId,
                "alertId": alert.id,
                "rfpId": rfp_id,
                "title": f"Alert: {rfp_data.get('title', 'New Tender')}",
                "body": f"New tender from {rfp_data.get('issuingAgency', 'Unknown')}",
                "read": False,
            })
            
            logger.info(f"Alert triggered: {alert.id} for RFP {rfp_id}")
    
    except Exception as e:
        logger.warning(f"Failed to trigger alerts: {e}")


async def sync_supabase_tenders_async(country: str = "Uganda", queue_extraction: bool = True):
    """
    Async function to sync tech-related tenders from Supabase API.
    Can be called directly without Celery.
    If country is None, fetches tenders from ALL countries.
    """
    connected_here = False
    try:
        await db.connect()
        connected_here = True
    except Exception as e:
        if "Already connected" not in str(e):
            raise

    try:
        tenders = await fetch_tenders_with_tor(country=country, limit=500)
        logger.info(f"Processing {len(tenders)} tech tenders")
        
        new_count = 0
        duplicate_count = 0
        error_count = 0
        
        for tender in tenders:
            try:
                mapped_rfp = map_tender_to_rfp(tender)
                
                existing = await db.rfp.find_unique(
                    where={"sourceUrl": mapped_rfp["sourceUrl"]}
                )
                if existing:
                    duplicate_count += 1
                    continue
                
                dup = await db.rfp.find_first(
                    where={"sourceHash": mapped_rfp["sourceHash"]}
                )
                if dup:
                    duplicate_count += 1
                    continue
                
                rfp = await db.rfp.create(data=mapped_rfp)
                new_count += 1
                logger.info(f"Created RFP {rfp.id}: {rfp.title}")
                
                # Trigger alerts for new RFP
                await trigger_alerts(rfp.id, mapped_rfp)
                
                if queue_extraction:
                    extract_rfp.delay(rfp.id, mapped_rfp["rawText"])
                
            except Exception as e:
                error_count += 1
                logger.error(f"Failed to process tender: {e}")
                continue
        
        logger.info(
            f"Sync complete: {new_count} new, {duplicate_count} duplicates, {error_count} errors"
        )
        return {
            "new_count": new_count,
            "duplicate_count": duplicate_count,
            "error_count": error_count,
        }
        
    except Exception as exc:
        logger.error(f"Supabase sync failed: {exc}")
        raise
    
    finally:
        if connected_here:
            await db.disconnect()


@app.task(bind=True, max_retries=3, queue="scrape_queue")
def sync_supabase_tenders(self, country: str = "Uganda"):
    """
    Sync tech-related tenders from Supabase API.
    Supports Tor routing for privacy.
    If country is None, fetches ALL countries.
    """
    asyncio.run(sync_supabase_tenders_async(country=country))
