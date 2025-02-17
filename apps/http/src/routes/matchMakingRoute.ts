import { Request, Response, Router } from "express";
import { userMiddleware } from "../middlewares/userMiddleware";
import { Redis } from "ioredis";

const redis = new Redis();

export const matchMakingRouter: Router = Router();

matchMakingRouter.post(
  "/join",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const playerId = req.userId;

      const alreadyInQueue = await redis.lpos("matchmaking_queue", playerId);
      if (alreadyInQueue !== null) {
        res.status(400).json({ message: "Already in queue" });
        return;
      }
      await redis.lpush("matchmaking_queue", playerId);

      res.status(200).json({
        message: "Matchmaking In Progress",
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Erro",
      });
    }
  }
);
