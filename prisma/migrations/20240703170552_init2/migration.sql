-- CreateTable
CREATE TABLE "Abwesenheitens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Abwesenheitens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Abwesenheitens" ADD CONSTRAINT "Abwesenheitens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
