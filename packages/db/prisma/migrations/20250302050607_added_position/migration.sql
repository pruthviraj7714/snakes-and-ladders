/*
  Warnings:

  - You are about to drop the column `gameData` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameData",
ADD COLUMN     "player1Position" INTEGER DEFAULT 1,
ADD COLUMN     "player2Position" INTEGER DEFAULT 1;
