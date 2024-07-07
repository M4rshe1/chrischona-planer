/*
  Warnings:

  - You are about to drop the `Abwesenheit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `abwesenheiten` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abwesenheit" DROP CONSTRAINT "Abwesenheit_userId_fkey";

-- DropForeignKey
ALTER TABLE "abwesenheiten" DROP CONSTRAINT "abwesenheiten_userId_fkey";

-- DropTable
DROP TABLE "Abwesenheit";

-- DropTable
DROP TABLE "abwesenheiten";

-- CreateTable
CREATE TABLE "abwesenheit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "abwesenheit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "abwesenheit" ADD CONSTRAINT "abwesenheit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
