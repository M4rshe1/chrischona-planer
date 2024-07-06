-- CreateTable
CREATE TABLE "access_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "message" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "relation" "RelationRoleLocation" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "access_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
