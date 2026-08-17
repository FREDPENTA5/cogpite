import hashlib
import logging
import os
import asyncio
import feedparser
import httpx
from bs4 import BeautifulSoup
from celery import Celery
from api.db.client import db
from api.workers.extract import extract_rfp
from api.workers.tender_sync import sync_supabase_tenders
from api.workers.ppda_sync import sync_ppda_tenders

logger = logging.getLogger(__name__)
app = Celery("dealscout", broker=os.environ.get("REDIS_URL", "redis://localhost:6379"))
app.conf.worker_redirect_stdouts = False


async def _discover_rss(base_url: str) -> list[str]:
    feed = feedparser.parse(base_url)
    return [entry.link for entry in feed.entries if hasattr(entry, "link")]


async def _discover_sitemap(base_url: str) -> list[str]:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(base_url)
    soup = BeautifulSoup(resp.text, "xml")
    return [loc.text for loc in soup.find_all("loc")]


async def _discover_spider(base_url: str) -> list[str]:
    from playwright.async_api import async_playwright
    urls = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--no-sandbox"])
        page = await browser.new_page()
        await page.goto(base_url, wait_until="networkidle", timeout=30000)
        anchors = await page.eval_on_selector_all(
            "a[href]", "els => els.map(e => e.href)"
        )
        urls = [a for a in anchors if "rfp" in a.lower() or "tender" in a.lower()]
        await browser.close()
    return urls


async def _fetch_text(url: str) -> str:
    async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
        resp = await client.get(url)

    content_type = resp.headers.get("content-type", "")
    if "pdf" in content_type or url.endswith(".pdf"):
        import pdfplumber, io
        with pdfplumber.open(io.BytesIO(resp.content)) as pdf:
            return "\n".join(p.extract_text() or "" for p in pdf.pages)

    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


@app.task(bind=True, max_retries=2, queue="scrape_queue")
def scrape_source(self, source_id: str):
    async def _run():
        await db.connect()
        source = await db.scrapesource.find_unique(where={"id": source_id})
        if not source or not source.active:
            await db.disconnect()
            return

        try:
            match source.scrapeType:
                case "RSS":
                    urls = await _discover_rss(source.baseUrl)
                case "SITEMAP":
                    urls = await _discover_sitemap(source.baseUrl)
                case "SPIDER":
                    urls = await _discover_spider(source.baseUrl)
                case _:
                    urls = []

            for url in urls:
                existing = await db.rfp.find_unique(where={"sourceUrl": url})
                if existing:
                    continue

                try:
                    raw_text = await _fetch_text(url)
                except Exception as e:
                    logger.warning(f"Failed to fetch {url}: {e}")
                    continue

                source_hash = hashlib.sha256(raw_text.encode()).hexdigest()

                dup = await db.rfp.find_first(where={"sourceHash": source_hash})
                if dup:
                    continue

                rfp = await db.rfp.create(data={
                    "sourceUrl": url,
                    "sourceHash": source_hash,
                    "title": url.split("/")[-1][:120],
                    "rawText": raw_text,
                    "status": "PENDING",
                    "extractedJson": {},
                })

                extract_rfp.delay(rfp.id, raw_text)
                logger.info(f"Queued RFP {rfp.id} from {url}")

            await db.scrapesource.update(
                where={"id": source_id},
                data={"lastScrapedAt": "now()", "errorCount": 0},
            )

        except Exception as exc:
            logger.error(f"Scrape failed for source {source_id}: {exc}")
            await db.scrapesource.update(
                where={"id": source_id},
                data={"errorCount": {"increment": 1}},
            )
            raise self.retry(exc=exc, countdown=120)
        finally:
            await db.disconnect()

    asyncio.run(_run())
