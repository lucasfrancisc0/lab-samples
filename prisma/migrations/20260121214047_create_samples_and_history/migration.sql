-- CreateEnum
CREATE TYPE "SampleStatus" AS ENUM ('PENDENTE', 'EM_ANALISE', 'CONCLUIDA', 'APROVADA', 'REJEITADA');

-- CreateTable
CREATE TABLE "samples" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "status" "SampleStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_status_history" (
    "id" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "fromStatus" "SampleStatus" NOT NULL,
    "toStatus" "SampleStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "samples_code_key" ON "samples"("code");

-- CreateIndex
CREATE INDEX "samples_status_idx" ON "samples"("status");

-- CreateIndex
CREATE INDEX "samples_analysisType_idx" ON "samples"("analysisType");

-- CreateIndex
CREATE INDEX "samples_collectedAt_idx" ON "samples"("collectedAt");

-- CreateIndex
CREATE INDEX "sample_status_history_sampleId_changedAt_idx" ON "sample_status_history"("sampleId", "changedAt");

-- AddForeignKey
ALTER TABLE "sample_status_history" ADD CONSTRAINT "sample_status_history_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
