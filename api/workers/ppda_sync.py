import asyncio
import httpx
from datetime import datetime, timezone
import logging
from celery import shared_task
from api.db import RLS
TECH_KEYWORDS = [
    "software", "system", "platform", "portal", "website", "app", 
    "ict", "it ", "technology", "network", "server", "cloud", "data",
    "digital", "automation", "api", "integration", "cyber", "security",
    "hardware", "computer", "laptop", "printer", "router", "switch"
]

def is_tech_related(title: str, summary: str) -> bool:
    searchable = f"{title or ''} {summary or ''}".lower()
    return any(kw in searchable for kw in TECH_KEYWORDS)
from api.db.client import db

logger = logging.getLogger(__name__)

PPDA_API_URL = "https://cdn.ppda.go.ug/api/v1/public/active-notices"

async def _fetch_and_process_ppda_tenders():
    """Fetch OCDS tenders from PPDA and save tech-related ones."""
    logger.info("Starting PPDA Uganda tender sync...")
    
    await db.connect()
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DealScout/1.0"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(PPDA_API_URL, headers=headers)
            response.raise_for_status()
            
            # The PPDA CDN API wraps data in `data.data` or a similar format.
            # We will handle standard OCDS format or typical Laravel pagination wrapper.
            result = response.json()
            if isinstance(result, dict) and "data" in result:
                tenders = result["data"]
                if isinstance(tenders, dict) and "data" in tenders:
                    tenders = tenders["data"]
            else:
                tenders = result if isinstance(result, list) else []

            logger.info(f"Fetched {len(tenders)} notices from PPDA.")
            
            inserted = 0
            for tender in tenders:
                try:
                    # Extract fields based on common PPDA / OCDS structures
                    title = tender.get("title") or tender.get("subject_of_procurement") or tender.get("tender", {}).get("title")
                    if not title:
                        continue
                    
                    description = tender.get("description") or tender.get("summary") or tender.get("tender", {}).get("description", "")
                    
                    # Filter for tech-related
                    if not is_tech_related(title, description):
                        continue
                        
                    # Agency
                    agency = tender.get("procuring_entity") or tender.get("entity_name") or tender.get("buyer", {}).get("name", "Uganda Government")
                    
                    # Deadlines
                    deadline_str = tender.get("deadline_date") or tender.get("tender", {}).get("tenderPeriod", {}).get("endDate")
                    deadline_date = None
                    if deadline_str:
                        try:
                            # Attempt basic parsing, PPDA often uses "YYYY-MM-DD HH:MM:SS"
                            dt = datetime.fromisoformat(deadline_str.replace("Z", "+00:00").replace(" ", "T"))
                            deadline_date = dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
                        except Exception:
                            pass
                            
                    published_str = tender.get("date_published") or tender.get("date")
                    published_date = None
                    if published_str:
                        try:
                            dt = datetime.fromisoformat(published_str.replace("Z", "+00:00").replace(" ", "T"))
                            published_date = dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
                        except Exception:
                            pass

                    # Default budget to generic values since PPDA doesn't always publish it upfront
                    budget_curr = "UGX"
                    
                    source_url = "https://gpp.ppda.go.ug"

                    await db.rfp.upsert(
                        where={"title": title},
                        data={
                            "create": {
                                "title": title,
                                "issuingAgency": agency,
                                "country": "Uganda",
                                "region": "East Africa",
                                "summary": description,
                                "deadline": deadline_date,
                                "publishedAt": published_date,
                                "budgetCurrency": budget_curr,
                                "status": "PENDING",
                                "confidenceScore": 0.85,
                                "sourceUrl": source_url,
                                "categories": ["Technology", "Government"],
                                "techStack": []
                            },
                            "update": {
                                "deadline": deadline_date,
                                "summary": description,
                            }
                        }
                    )
                    inserted += 1
                except Exception as e:
                    logger.error(f"Error processing PPDA tender: {e}")
                    
            logger.info(f"Successfully processed {inserted} tech tenders from PPDA.")

    except Exception as e:
        logger.error(f"PPDA API error: {e}")
    finally:
        await db.disconnect()

@shared_task(name="sync_ppda_tenders")
def sync_ppda_tenders():
    asyncio.run(_fetch_and_process_ppda_tenders())

