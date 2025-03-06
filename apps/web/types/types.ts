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
}


export type PlayerType = {
  id: 1 | 2;
  user: {
    id: string;
    username : string;
  };
  position: number;
  emoji: string;
};

export type GameStateType = {
  player1: string;
  player2: string;
  player1Position: number;
  player2Position: number;
  currentPlayer: 1 | 2;
};
