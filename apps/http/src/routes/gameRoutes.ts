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
    const {title, bidAmount} = req.body;
    const game = await prisma.game.create({
      data : {
        bidAmount,
        title,
        player1Id : null, 
        player2Id : null
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

gameRouter.get('/:gameId', async (req : Request, res : Response) : Promise<void> => {
  try {
    const gameId = req.params.gameId;
    
    const game = await prisma.game.findFirst({
      where :  {
        id : gameId
      },
      include : {
        player1 : true,
        player2 : true
      }
    });

    res.status(200).json({
      game
    });
  } catch (error) {
    res.status(500).json({
      message : "Internal Server Error"
    })
    return;
  }

})

gameRouter.delete('/:gameId', async (req : Request, res : Response) : Promise<void> => {
  try {

    const gameId = req.params.gameId;
    
    await prisma.game.delete({
      where :  {
        id : gameId
      }
    });

    res.status(200).json({
      message : "Game Room Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json({
      message : "Internal Server Error"
    })
    return;
  }

})
