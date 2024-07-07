/*
  Warnings:

  - You are about to drop the `Abwesenheitens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abwesenheitens" DROP CONSTRAINT "Abwesenheitens_userId_fkey";

-- DropTable
DROP TABLE "Abwesenheitens";

-- CreateTable
CREATE TABLE "Abwesenheit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Abwesenheit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Abwesenheit" ADD CONSTRAINT "Abwesenheit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
