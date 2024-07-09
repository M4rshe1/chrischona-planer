/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Gottesdienst` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Gottesdienst_User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `abwesenheit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `access_code` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `access_request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_locationID]` on the table `team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user_location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_locationID` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team" ADD COLUMN     "name_locationID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gottesdienst_id_key" ON "Gottesdienst"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Gottesdienst_User_id_key" ON "Gottesdienst_User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "abwesenheit_id_key" ON "abwesenheit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "access_code_id_key" ON "access_code"("id");

-- CreateIndex
CREATE UNIQUE INDEX "access_request_id_key" ON "access_request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_key" ON "team"("id");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_locationID_key" ON "team"("name_locationID");

-- CreateIndex
CREATE UNIQUE INDEX "user_location_id_key" ON "user_location"("id");
