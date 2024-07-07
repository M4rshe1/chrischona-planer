-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "access_request" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
