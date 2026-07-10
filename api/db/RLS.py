from prisma import Prisma
from prisma.models import Rfp, SavedRfp
from api.db.client import db

async def list_rfps(
    workspace_id: str,
    budget_tier: str | None = None,
    complexity: str | None = None,
    deadline_before: str | None = None,
    q: str | None = None,
    cursor: str | None = None,
    take: int = 20,
) -> list[Rfp]:
    where: dict = {"status": "COMPLETE"}
    if budget_tier:
        where["budgetTier"] = budget_tier
    if complexity:
        where["complexity"] = complexity
    if deadline_before:
        where["deadline"] = {"lte": deadline_before}

    if q:
        results = await db.query_raw(
            """
            SELECT * FROM "Rfp"
            WHERE status = 'COMPLETE'
            AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,''))
                @@ plainto_tsquery('english', $1)
            ORDER BY "createdAt" DESC
            LIMIT $2
            """,
            q, take,
            model=Rfp,
        )
        return results

    return await db.rfp.find_many(
        where=where,
        order={"createdAt": "desc"},
        take=take,
        cursor={"id": cursor} if cursor else None,
        skip=1 if cursor else 0,
    )


async def get_rfp(rfp_id: str) -> Rfp | None:
    return await db.rfp.find_unique(where={"id": rfp_id})


async def toggle_save(
    rfp_id: str, workspace_id: str, user_id: str
) -> dict:
    existing = await db.savedrfp.find_unique(
        where={"rfpId_workspaceId": {"rfpId": rfp_id, "workspaceId": workspace_id}}
    )
    if existing:
        await db.savedrfp.delete(where={"id": existing.id})
        return {"saved": False}
    await db.savedrfp.create(
        data={"rfpId": rfp_id, "workspaceId": workspace_id, "savedById": user_id}
    )
    return {"saved": True}


async def list_saved(workspace_id: str) -> list[SavedRfp]:
    return await db.savedrfp.find_many(
        where={"workspaceId": workspace_id},
        include={"rfp": True},
        order={"createdAt": "desc"},
    )