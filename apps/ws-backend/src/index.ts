import { WebSocketServer } from "ws";
import gameManager from "./gameManager";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";
config();

const wss = new WebSocketServer({ port: 8080 });

function verifyUser(token: string) {
  try {
    const user = verify(
      token,
      process.env.NEXTAUTH_SECRET!
    ) as JwtPayload;
    
    return user.id;
  } catch (error) {
    console.error("Unauthorized User!");
    return;
  }
}

wss.on("connection", function connection(ws, req) {
  if(!req.url) {
    return;
  }
  const token = req.url.split("?token=")[1];

  if (!token) {
    ws.send(JSON.stringify({
      error : "Token not found!"
    }))
    ws.close();
    return;
  }

  ws.on("error", console.error);

  const playerId = verifyUser(token);

  if (!playerId) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Unauthorized User!",
      })
    );
    return;
  }

  ws.on("message", function message(data: string) {
    const payload = JSON.parse(data);

    switch (payload.type) {
      case "JOIN_GAME":
        gameManager.joinGame(playerId, payload.gameId, ws);
        break;
      case "LEAVE_GAME":
        gameManager.leaveGame(playerId, payload.gameId);
        break;
      case "ROLL_DICE":
        gameManager.rollDice(playerId, payload.gameId);
        break;
      case "SNAKE_ATE":
        gameManager.snakeAte(playerId, payload.gameId);
        break;
      case "LADDER_FOUND":
        gameManager.ladderRise(playerId, payload.gameId);
        break;
    }
  });
});
