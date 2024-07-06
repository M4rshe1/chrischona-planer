/*
  Warnings:

  - You are about to drop the `access_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "access_codes" DROP CONSTRAINT "access_codes_locationId_fkey";

-- DropTable
DROP TABLE "access_codes";

-- CreateTable
CREATE TABLE "access_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "validuntil" TIMESTAMP(3),
    "maxuses" INTEGER,
    "used" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "access_code_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
