import asyncio
from api.db.client import db

SEED_RFPS = [
  {
    "sourceUrl": "https://example.com/rfp/001",
    "sourceHash": "abc123",
    "title": "Supply of ICT Equipment – Ministry of Health Uganda",
    "issuingAgency": "Ministry of Health",
    "country": "Uganda",
    "region": "Central",
    "deadline": "2026-08-15T00:00:00Z",
    "budgetMin": 50000,
    "budgetMax": 250000,
    "budgetCurrency": "USD",
    "budgetTier": "MEDIUM",
    "complexity": "HIGH",
    "summary": "Procurement of servers, networking equipment and 200 workstations for district health facilities across Uganda.",
    "rawText": "",
    "techStack": ["Linux", "VMware", "Cisco", "Dell"],
    "categories": ["hardware", "networking", "healthcare"],
    "languagesRequired": ["English"],
    "confidenceScore": 0.91,
    "status": "COMPLETE",
    "extractedJson": "{}",
  },
  {
    "sourceUrl": "https://example.com/rfp/002",
    "sourceHash": "def456",
    "title": "National Data Centre Cloud Migration – NITA-U",
    "issuingAgency": "NITA-U",
    "country": "Uganda",
    "region": "Kampala",
    "deadline": "2026-07-20T00:00:00Z",
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "budgetCurrency": "USD",
    "budgetTier": "LARGE",
    "complexity": "CRITICAL",
    "summary": "Migration of government on-premise infrastructure to a hybrid cloud architecture. Includes DevOps tooling setup and 12-month managed support.",
    "rawText": "",
    "techStack": ["AWS", "Terraform", "Kubernetes", "Docker", "Ansible"],
    "categories": ["cloud", "devops", "government"],
    "languagesRequired": ["English"],
    "confidenceScore": 0.87,
    "status": "COMPLETE",
    "extractedJson": "{}",
  },
  {
    "sourceUrl": "https://example.com/rfp/003",
    "sourceHash": "ghi789",
    "title": "HRMIS Software Development – Makerere University",
    "issuingAgency": "Makerere University",
    "country": "Uganda",
    "region": "Kampala",
    "deadline": "2026-09-01T00:00:00Z",
    "budgetMin": 30000,
    "budgetMax": 80000,
    "budgetCurrency": "USD",
    "budgetTier": "MEDIUM",
    "complexity": "HIGH",
    "summary": "Development of a Human Resource Management Information System covering payroll, leave, appraisals, and recruitment for 5,000+ staff.",
    "rawText": "",
    "techStack": ["React", "Node.js", "PostgreSQL", "REST API"],
    "categories": ["software", "HRMIS", "education"],
    "languagesRequired": ["English"],
    "confidenceScore": 0.94,
    "status": "COMPLETE",
    "extractedJson": "{}",
  },
]

async def seed():
    await db.connect()
    for rfp in SEED_RFPS:
        existing = await db.rfp.find_unique(where={"sourceUrl": rfp["sourceUrl"]})
        if not existing:
            await db.rfp.create(data=rfp)
            print(f"Seeded: {rfp['title']}")
        else:
            print(f"Skipped (exists): {rfp['title']}")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())
