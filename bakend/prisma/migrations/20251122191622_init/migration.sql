-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Bin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "binId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "capacityUsed" REAL NOT NULL DEFAULT 0,
    "acceptsRecycling" BOOLEAN NOT NULL DEFAULT true,
    "lastOperationAt" DATETIME,
    "apiKey" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeId" TEXT NOT NULL,
    "binId" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unused',
    "redeemedByUserId" TEXT,
    "expiresAt" DATETIME,
    "hmac" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    CONSTRAINT "Operation_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin" ("binId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operation_redeemedByUserId_fkey" FOREIGN KEY ("redeemedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointsTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PointsTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "pointsRequired" INTEGER NOT NULL,
    "availability" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bin_binId_key" ON "Bin"("binId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_codeId_key" ON "Operation"("codeId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_hmac_key" ON "Operation"("hmac");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_nonce_key" ON "Operation"("nonce");
