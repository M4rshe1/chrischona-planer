/*
  Warnings:

  - You are about to drop the column `userId` on the `team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "team" DROP CONSTRAINT "team_userId_fkey";

-- AlterTable
ALTER TABLE "team" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "team_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "team_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_user_id_key" ON "team_user"("id");

-- AddForeignKey
ALTER TABLE "team_user" ADD CONSTRAINT "team_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_user" ADD CONSTRAINT "team_user_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
