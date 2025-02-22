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
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

gameRouter.post('/create', userMiddleware, async (req : Request, res :Response) : Promise<void> => {
  try {
    const bidAmount = req.body.bidAmount;
    const game = await prisma.game.create({
      data : {
        bidAmount,
        player1Id : req.userId, 
        player2Id : ""
      }
    })

    res.status(201).json({
      message : "Game Room Created Successfully",
      game
    });
    return;
  } catch (error) {
    res.status(500).json({
      message : "Internal Server Error"
    });
  }
})

