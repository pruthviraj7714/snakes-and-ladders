export interface IGame {
  id: string;
  title :string;
  bidAmount: number;
  status: "WAITING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startedAt: Date;
  player1Id: string | null;
  player2Id: string | null;
  winnerId: string | null;
  currentTurn: string | null;
  gameData: any;
}
