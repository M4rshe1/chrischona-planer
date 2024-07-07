/*
  Warnings:

  - You are about to drop the column `comment` on the `Gottesdienst` table. All the data in the column will be lost.
  - You are about to drop the column `pastor` on the `Gottesdienst` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `access_code` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gottesdienst" DROP COLUMN "comment",
DROP COLUMN "pastor",
ADD COLUMN     "externerPastor" TEXT,
ADD COLUMN     "kommentar" TEXT;

-- AlterTable
ALTER TABLE "access_code" DROP COLUMN "code";
