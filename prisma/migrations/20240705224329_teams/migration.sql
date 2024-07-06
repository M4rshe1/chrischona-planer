-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" "RelationRoleGottesdienst" NOT NULL DEFAULT 'TEAM',

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
