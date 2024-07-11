/*
  Warnings:

  - You are about to drop the column `userId` on the `Zeitplan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Zeitplan" DROP CONSTRAINT "Zeitplan_userId_fkey";

-- AlterTable
ALTER TABLE "Zeitplan" DROP COLUMN "userId";
