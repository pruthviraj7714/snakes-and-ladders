-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DRAW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "gamesDraw" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "bidAmount" INTEGER NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT,
    "winnerId" TEXT,
    "currentTurn" TEXT,
    "gameData" JSONB,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "Game"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1Id_player2Id_key" ON "Game"("player1Id", "player2Id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
