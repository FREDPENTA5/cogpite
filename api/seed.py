import asyncio
from prisma import Prisma
from datetime import datetime, timedelta

async def seed():
    prisma = Prisma()
    await prisma.connect()
    
    print("Clearing existing data...")
    await prisma.savedrfp.delete_many()
    await prisma.rfp.delete_many()

    print("Seeding database with mock RFPs...")
    
    now = datetime.now()
    
    await prisma.rfp.create(
        data={
            "title": "Ministry of Health Core Infrastructure Upgrade",
            "issuingAgency": "Ministry of Health",
            "country": "Kenya",
            "summary": "Full-scale digital transformation for regional health clinics including EMR deployment, cloud migration, and secure patient data pipelines.",
            "sourceUrl": "https://example.com/rfp/1",
            "sourceHash": "hash1",
            "rawText": "Full text...",
            "extractedJson": '{"key":"value"}',
            "deadline": now + timedelta(days=14),
            "budgetTier": "ENTERPRISE",
            "complexity": "CRITICAL",
            "techStack": ["PostgreSQL", "React", "AWS", "FHIR"],
            "confidenceScore": 0.94,
            "status": "COMPLETE"
        }
    )

    await prisma.rfp.create(
        data={
            "title": "Public Works Payment Portal Redesign",
            "issuingAgency": "Dept of Public Works",
            "country": "Rwanda",
            "summary": "Modernization of contractor payment portal. Requires mobile-first approach and integration with existing legacy accounting systems.",
            "sourceUrl": "https://example.com/rfp/2",
            "sourceHash": "hash2",
            "rawText": "Full text...",
            "extractedJson": '{"key":"value"}',
            "deadline": now + timedelta(days=5),
            "budgetTier": "LARGE",
            "complexity": "HIGH",
            "techStack": ["Next.js", "Python", "Stripe"],
            "confidenceScore": 0.88,
            "status": "COMPLETE"
        }
    )

    await prisma.rfp.create(
        data={
            "title": "Municipal Parking Optimization AI",
            "issuingAgency": "Nairobi City County",
            "country": "Kenya",
            "summary": "Computer vision system for detecting parking violations and space availability across 500+ city spots using existing CCTV cameras.",
            "sourceUrl": "https://example.com/rfp/3",
            "sourceHash": "hash3",
            "rawText": "Full text...",
            "extractedJson": '{"key":"value"}',
            "deadline": now + timedelta(days=21),
            "budgetTier": "MEDIUM",
            "complexity": "HIGH",
            "techStack": ["PyTorch", "OpenCV", "Edge Computing"],
            "confidenceScore": 0.72,
            "status": "PENDING"
        }
    )

    print("Seed complete!")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())
