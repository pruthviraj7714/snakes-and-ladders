import { WebSocket } from "ws";
import prisma from "@repo/db/client";

interface Game {
  id: string;
  player1: string;
  player2: string;
  rolls: number[];
  currTurn: string;
  player1Position: number;
  player2Position: number;
  player1Socket: WebSocket | null;
  player2Socket: WebSocket | null;
}

const snakes: Record<number, number> = {
  99: 45,
  95: 75,
  88: 24,
  62: 19,
  36: 6,
};

const ladders: Record<number, number> = {
  7: 25,
  13: 31,
  21: 42,
  28: 84,
  37: 63,
  51: 67,
};

class GameManager {
  private static gameManagerInstance: GameManager;
  private games: Map<string, Game> = new Map();

  private constructor() {}

  public static getInstance(): GameManager {
    if (!this.gameManagerInstance) {
      this.gameManagerInstance = new GameManager();
    }
    return this.gameManagerInstance;
  }

  public async joinGame(userId: string, gameId: string, ws: WebSocket) {
    let game = this.games.get(gameId);

    if (!game) {
      game = {
        id: gameId,
        player1: userId,
        player2: "",
        currTurn: userId,
        player1Position: 1,
        player2Position: 1,
        rolls: [],
        player1Socket: ws,
        player2Socket: null,
      };
      this.games.set(gameId, game);
      try {
        await prisma.game.update({
          where: {
            id: gameId,
          },
          data: {
            player1Id: userId,
          },
        });
        
      } catch (error) {
        console.error(error);
      }
    } else if (!game.player2 && userId !== game.player1) {
      game.player2 = userId;
      game.player2Socket = ws;

      try{
        await prisma.game.update({
          where: {
            id: gameId,
          },
          data: {
            player2Id: userId,
            status : "ACTIVE"
          },
        });

      }catch(error) {
        console.error(error);
      }
    } else if (game.player1 === userId) {
      game.player1Socket = ws;
    } else if (game.player2 === userId) {
      game.player2Socket = ws;
    } else {
      ws.send(JSON.stringify({ type: "ERROR", message: "Game is full!" }));
      return;
    }

    game.player1Socket?.send(JSON.stringify({ type: "PLAYER_JOINED", game }));
    game.player2Socket?.send(JSON.stringify({ type: "PLAYER_JOINED", game }));
  }

  public leaveGame(userId: string, gameId: string) {
    const game = this.games.get(gameId);
    if (!game) return;

    if (game.player1 === userId) {
      game.player1 = "";
      game.player1Socket = null;
    } else if (game.player2 === userId) {
      game.player2 = "";
      game.player2Socket = null;
    }

    game.player1Socket?.send(
      JSON.stringify({ type: "ROOM_LEFT", userId, gameId })
    );
    game.player2Socket?.send(
      JSON.stringify({ type: "ROOM_LEFT", userId, gameId })
    );

    if (!game.player1 && !game.player2) {
      this.games.delete(gameId);
    }
  }

  public async rollDice(userId: string, gameId: string) {
    let game = this.games.get(gameId);
    if (!game) return;

    if (game.currTurn !== userId) {
      console.log("Not your turn!");
      return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    game.rolls.push(diceRoll);

    if (userId === game.player1) {
      game.player1Position += diceRoll;

      game.currTurn = game.player2;
    } else if (userId === game.player2) {
      game.player2Position += diceRoll;

      game.currTurn = game.player1;
    }

    await prisma.game.update({
      where : {
        id : gameId
      },
      data : {
        player1Position : game.player1Position,
        player2Position : game.player2Position,
        currentTurn : game.currTurn
      }
    })

    game.player1Socket?.send(
      JSON.stringify({ type: "DICE_ROLLED", diceRoll, userId, game })
    );
    game.player2Socket?.send(
      JSON.stringify({ type: "DICE_ROLLED", diceRoll, userId, game })
    );
  }

  public async snakeAte(userId: string, gameId: string) {
    let game = this.games.get(gameId);
    if (!game) return;

    if (game.player1 === userId) {
      if (snakes[game.player1Position]) {
        //@ts-ignore
        game.player1Position = snakes[game.player1Position];
        game.currTurn = game.player2;
      }
    } else if (game.player2 === userId) {
      if (snakes[game.player2Position]) {
        //@ts-ignore
        game.player2Position = snakes[game.player2Position];
        game.currTurn = game.player1;
      }
    }

    await prisma.game.update({
      where : {
        id : gameId
      },
      data : {
        player1Position : game.player1Position,
        player2Position : game.player2Position,
        currentTurn : game.currTurn
      }
    })

    game.player1Socket?.send(
      JSON.stringify({ type: "SNAKE_EATEN_OUT", userId, game })
    );
    game.player2Socket?.send(
      JSON.stringify({ type: "SNAKE_EATEN_OUT", userId, game })
    );
  }

  public async ladderRise(userId: string, gameId: string) {
    let game = this.games.get(gameId);
    if (!game) return;

    if (game.player1 === userId) {
      if (ladders[game.player1Position]) {
        //@ts-ignore
        game.player1Position = ladders[game.player1Position];
      }
    } else if (game.player2 === userId) {
      if (ladders[game.player2Position]) {
        //@ts-ignore
        game.player2Position = ladders[game.player2Position];
      }
    }

    await prisma.game.update({
      where : {
        id : gameId
      },
      data : {
        player1Position : game.player1Position,
        player2Position : game.player2Position,
        currentTurn : game.currTurn
      }
    })

    game.player1Socket?.send(
      JSON.stringify({ type: "RISED_ON_LADDER", userId, game })
    );
    game.player2Socket?.send(
      JSON.stringify({ type: "RISED_ON_LADDER", userId, game })
    );
  }
}

export default GameManager.getInstance();
