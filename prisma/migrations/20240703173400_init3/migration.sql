/*
  Warnings:

  - You are about to drop the `User_Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LocationRole" AS ENUM ('OWNER', 'MANAGER', 'TEAMMEMBER', 'VIEWER');

-- DropForeignKey
ALTER TABLE "User_Location" DROP CONSTRAINT "User_Location_locationId_fkey";

-- DropForeignKey
ALTER TABLE "User_Location" DROP CONSTRAINT "User_Location_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locationRole" "LocationRole" NOT NULL DEFAULT 'VIEWER';

-- DropTable
DROP TABLE "User_Location";

-- DropEnum
DROP TYPE "RelationRoleLocation";

-- CreateTable
CREATE TABLE "_LocationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToUser_AB_unique" ON "_LocationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToUser_B_index" ON "_LocationToUser"("B");

-- AddForeignKey
ALTER TABLE "_LocationToUser" ADD CONSTRAINT "_LocationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToUser" ADD CONSTRAINT "_LocationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
