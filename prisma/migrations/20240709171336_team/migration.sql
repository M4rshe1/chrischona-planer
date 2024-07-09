-- AlterTable
ALTER TABLE "team" ADD COLUMN     "locationId" TEXT NOT NULL DEFAULT '0';

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
