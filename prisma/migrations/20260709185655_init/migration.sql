-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('LOCAL_SCOUT', 'ENTERPRISE_HUNTER');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ComplexityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RfpStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "ScrapeType" AS ENUM ('RSS', 'SITEMAP', 'SPIDER', 'MANUAL');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "PlanTier" NOT NULL DEFAULT 'LOCAL_SCOUT',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rfp" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuingAgency" TEXT,
    "country" TEXT,
    "region" TEXT,
    "publishedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "budgetMin" DECIMAL(18,2),
    "budgetMax" DECIMAL(18,2),
    "budgetCurrency" TEXT DEFAULT 'USD',
    "budgetTier" "BudgetTier",
    "complexity" "ComplexityLevel",
    "summary" TEXT,
    "rawText" TEXT NOT NULL,
    "extractedJson" JSONB NOT NULL,
    "techStack" TEXT[],
    "categories" TEXT[],
    "languagesRequired" TEXT[],
    "pageCount" INTEGER,
    "confidenceScore" DOUBLE PRECISION,
    "status" "RfpStatus" NOT NULL DEFAULT 'PENDING',
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rfp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedRfp" (
    "id" TEXT NOT NULL,
    "rfpId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "savedById" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRfp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "rfpId" TEXT,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "scrapeType" "ScrapeType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastScrapedAt" TIMESTAMP(3),
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_stripeCustomerId_key" ON "Workspace"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_stripeSubscriptionId_key" ON "Workspace"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Workspace_slug_idx" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_workspaceId_idx" ON "User"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Rfp_sourceUrl_key" ON "Rfp"("sourceUrl");

-- CreateIndex
CREATE INDEX "Rfp_status_idx" ON "Rfp"("status");

-- CreateIndex
CREATE INDEX "Rfp_deadline_idx" ON "Rfp"("deadline");

-- CreateIndex
CREATE INDEX "Rfp_budgetTier_idx" ON "Rfp"("budgetTier");

-- CreateIndex
CREATE INDEX "Rfp_complexity_idx" ON "Rfp"("complexity");

-- CreateIndex
CREATE INDEX "Rfp_country_region_idx" ON "Rfp"("country", "region");

-- CreateIndex
CREATE INDEX "SavedRfp_workspaceId_idx" ON "SavedRfp"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedRfp_rfpId_workspaceId_key" ON "SavedRfp"("rfpId", "workspaceId");

-- CreateIndex
CREATE INDEX "Alert_workspaceId_idx" ON "Alert"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapeSource_baseUrl_key" ON "ScrapeSource"("baseUrl");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRfp" ADD CONSTRAINT "SavedRfp_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRfp" ADD CONSTRAINT "SavedRfp_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRfp" ADD CONSTRAINT "SavedRfp_savedById_fkey" FOREIGN KEY ("savedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
