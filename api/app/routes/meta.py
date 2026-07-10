from fastapi import APIRouter
from typing import List, Dict, Any
from prisma.models import Rfp
from api.db.client import db
from datetime import datetime, timedelta

router = APIRouter(prefix="/rfps/meta", tags=["meta"])

@router.get("/categories")
async def list_categories():
    query = """
    SELECT unnest(categories) as category, COUNT(*) as count
    FROM "Rfp" WHERE status='COMPLETE'
    GROUP BY category ORDER BY count DESC
    """
    results = await db.query_raw(query)
    return results

@router.get("/tech-stacks")
async def list_tech_stacks():
    query = """
    SELECT unnest("techStack") as tech, COUNT(*) as count
    FROM "Rfp" WHERE status='COMPLETE'
    GROUP BY tech ORDER BY count DESC LIMIT 30
    """
    results = await db.query_raw(query)
    return results

@router.get("/analytics")
async def get_analytics():
    # Execute a batch of raw queries for the analytics dashboard
    by_budget_tier = await db.query_raw("""
        SELECT "budgetTier" as tier, COUNT(*) as count
        FROM "Rfp" WHERE status='COMPLETE' AND "budgetTier" IS NOT NULL
        GROUP BY "budgetTier"
    """)
    
    by_complexity = await db.query_raw("""
        SELECT complexity, COUNT(*) as count
        FROM "Rfp" WHERE status='COMPLETE' AND complexity IS NOT NULL
        GROUP BY complexity
    """)
    
    by_country = await db.query_raw("""
        SELECT country, COUNT(*) as count
        FROM "Rfp" WHERE status='COMPLETE' AND country IS NOT NULL
        GROUP BY country ORDER BY count DESC LIMIT 10
    """)
    
    top_agencies = await db.query_raw("""
        SELECT "issuingAgency" as agency, COUNT(*) as count
        FROM "Rfp" WHERE status='COMPLETE' AND "issuingAgency" IS NOT NULL
        GROUP BY "issuingAgency" ORDER BY count DESC LIMIT 10
    """)
    
    # Date logic for last 30 days
    rfps_over_time = await db.query_raw("""
        SELECT DATE("publishedAt") as date, COUNT(*) as count
        FROM "Rfp" 
        WHERE status='COMPLETE' 
          AND "publishedAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE("publishedAt")
        ORDER BY date ASC
    """)
    
    avg_confidence_res = await db.query_raw("""
        SELECT AVG("confidenceScore") as avg
        FROM "Rfp" WHERE status='COMPLETE' AND "confidenceScore" IS NOT NULL
    """)
    avg_confidence = float(avg_confidence_res[0].get('avg', 0)) if avg_confidence_res and avg_confidence_res[0].get('avg') else 0.0
    
    deadline_this_week_res = await db.query_raw("""
        SELECT COUNT(*) as count
        FROM "Rfp" 
        WHERE status='COMPLETE' 
          AND deadline >= NOW() 
          AND deadline <= NOW() + INTERVAL '7 days'
    """)
    deadline_this_week = int(deadline_this_week_res[0].get('count', 0)) if deadline_this_week_res else 0
    
    total_complete_res = await db.query_raw("""
        SELECT COUNT(*) as count
        FROM "Rfp" WHERE status='COMPLETE'
    """)
    total_complete = int(total_complete_res[0].get('count', 0)) if total_complete_res else 0
    
    return {
        "by_budget_tier": by_budget_tier,
        "by_complexity": by_complexity,
        "by_country": by_country,
        "rfps_over_time": rfps_over_time,
        "top_agencies": top_agencies,
        "avg_confidence": avg_confidence,
        "deadline_this_week": deadline_this_week,
        "total_complete": total_complete
    }
