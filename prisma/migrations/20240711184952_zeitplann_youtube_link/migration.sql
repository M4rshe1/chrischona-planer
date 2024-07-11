/*
  Warnings:

  - You are about to drop the column `dateFrom` on the `Zeitplan` table. All the data in the column will be lost.
  - You are about to drop the column `kommentar` on the `Zeitplan` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Zeitplan` table. All the data in the column will be lost.
  - Added the required column `timeFrom` to the `Zeitplan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gottesdienst" ADD COLUMN     "youtubeLink" TEXT;

-- AlterTable
ALTER TABLE "Zeitplan" DROP COLUMN "dateFrom",
DROP COLUMN "kommentar",
DROP COLUMN "role",
ADD COLUMN     "bild_ton" TEXT,
ADD COLUMN     "timeFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "was" TEXT,
ADD COLUMN     "wer" TEXT;
