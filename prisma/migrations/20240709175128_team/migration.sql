/*
  Warnings:

  - You are about to drop the column `name_locationID` on the `team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name_locationId]` on the table `team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_locationId` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "team_name_locationID_key";

-- AlterTable
ALTER TABLE "team" DROP COLUMN "name_locationID",
ADD COLUMN     "name_locationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "team_name_locationId_key" ON "team"("name_locationId");
