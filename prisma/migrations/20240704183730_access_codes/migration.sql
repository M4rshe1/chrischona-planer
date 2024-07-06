-- CreateTable
CREATE TABLE "access_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "validuntil" TIMESTAMP(3),
    "maxuses" INTEGER,
    "used" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "access_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
