-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player1Id_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "player1Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
