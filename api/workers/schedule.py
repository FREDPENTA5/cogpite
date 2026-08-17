"""
Celery Beat Scheduling Configuration
Schedule periodic tasks like daily tender syncs
"""

from celery.schedules import crontab
from api.workers.tender_sync import app as celery_app

# Beat Schedule Configuration
celery_app.conf.beat_schedule = {
    "sync-supabase-tenders-daily": {
        "task": "api.workers.tender_sync.sync_supabase_tenders",
        "schedule": crontab(hour=2, minute=0),  # Daily at 2 AM UTC
        "args": ("Uganda",),
        "kwargs": {},
        "options": {
            "queue": "scrape_queue",
            "expires": 300,
        }
    },
    "sync-supabase-tenders-every-6-hours": {
        "task": "api.workers.tender_sync.sync_supabase_tenders",
        "schedule": crontab(minute=0, hour="*/6"),  # Every 6 hours
        "args": ("Uganda",),
        "kwargs": {},
        "options": {
            "queue": "scrape_queue",
            "expires": 300,
        }
    },
    "sync-ppda-tenders-daily": {
        "task": "sync_ppda_tenders",
        "schedule": crontab(hour=4, minute=0),  # Daily at 4 AM UTC
        "args": (),
        "kwargs": {},
        "options": {
            "queue": "scrape_queue",
            "expires": 300,
        }
    },
}

celery_app.conf.timezone = 'UTC'

