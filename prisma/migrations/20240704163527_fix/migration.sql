-- CreateEnum
CREATE TYPE "SiteRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RelationRoleLocation" AS ENUM ('OWNER', 'MANAGER', 'TEAMMEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "RelationRoleGottesdienst" AS ENUM ('TECHNIK_BILD', 'TECHNIK_TON', 'TECHNIK_STREAM', 'PREDIGER', 'MODERATOR', 'MUSIK', 'KINDERHUTTE', 'KINDERTREFF', 'TEENETALK', 'BISTRO', 'PUTZTEAM', 'TEAM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "SiteRole" NOT NULL DEFAULT 'USER',
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gottesdienst" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "anlass" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "abendmahl" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "pastor" TEXT,
    "thema" TEXT,
    "textstelle" TEXT,
    "kontakt" TEXT,
    "findetStatt" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Gottesdienst_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Gottesdienst_User" (
    "id" TEXT NOT NULL,
    "gottesdienstId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RelationRoleGottesdienst" NOT NULL DEFAULT 'TEAM',

    CONSTRAINT "Gottesdienst_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_location" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "relation" "RelationRoleLocation" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "user_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "Gottesdienst" ADD CONSTRAINT "Gottesdienst_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abwesenheitens" ADD CONSTRAINT "Abwesenheitens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gottesdienst_User" ADD CONSTRAINT "Gottesdienst_User_gottesdienstId_fkey" FOREIGN KEY ("gottesdienstId") REFERENCES "Gottesdienst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gottesdienst_User" ADD CONSTRAINT "Gottesdienst_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
