import { Request, Response, Router } from "express";
import prisma from "@repo/db/client";
import { userMiddleware } from "../middlewares/userMiddleware";

export const gameRouter: Router = Router();

gameRouter.get("/games", userMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const games = await prisma.game.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
      },
    });
    res.status(200).json({
      games,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
