/*
  Warnings:

  - You are about to drop the column `date` on the `Gottesdienst` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gottesdienst" DROP COLUMN "date",
ADD COLUMN     "dateFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateUntill" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
