import asyncio
from prisma import Prisma

async def check():
    p = Prisma()
    await p.connect()
    count = await p.rfp.count()
    rfps = await p.rfp.find_many()
    print("COUNT:", count)
    for r in rfps:
        print(r.id, r.title, r.status)
    await p.disconnect()

asyncio.run(check())
