-- AlterEnum
ALTER TYPE "RelationRoleGottesdienst" ADD VALUE 'BEGRUSSUNG';

-- CreateTable
CREATE TABLE "Zeitplan" (
    "id" TEXT NOT NULL,
    "gottesdienstId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "kommentar" TEXT,
    "role" "RelationRoleGottesdienst" NOT NULL DEFAULT 'TEAM',

    CONSTRAINT "Zeitplan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zeitplan_id_key" ON "Zeitplan"("id");

-- AddForeignKey
ALTER TABLE "Zeitplan" ADD CONSTRAINT "Zeitplan_gottesdienstId_fkey" FOREIGN KEY ("gottesdienstId") REFERENCES "Gottesdienst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zeitplan" ADD CONSTRAINT "Zeitplan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
