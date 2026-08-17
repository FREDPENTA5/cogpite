import asyncio
from api.db.client import db

async def main():
    await db.connect()
    # Delete where country is not Uganda
    deleted = await db.rfp.delete_many(where={"country": {"not": "Uganda"}})
    print(f"Deleted {deleted} non-Uganda RFPs.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
