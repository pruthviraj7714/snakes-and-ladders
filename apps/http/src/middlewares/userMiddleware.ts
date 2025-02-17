import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const headers = req.headers.authorization;

  const token = headers?.split(" ")[1];

  if (!token) {
    res.status(400).json({
      message: "Token not found!",
    });
    return;
  }

  try {
    const user = verify(token, process.env.NEXTAUTH_SECRET as string);
    req.userId = (user as JwtPayload).id;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Unauthorized User",
    });
  }
};
