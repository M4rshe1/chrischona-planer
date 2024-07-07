/*
  Warnings:

  - You are about to drop the column `approvallNeeded` on the `access_code` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "access_code" DROP COLUMN "approvallNeeded",
ADD COLUMN     "approvalNeeded" BOOLEAN NOT NULL DEFAULT false;
