import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadCustom } from "../interface/jwt.model";

export const authenticationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      error: true,
      success: null,
      message: "Token no proporcionado.",
    });

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayloadCustom;
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      success: null,
      message: "Token inválido o expirado.",
    });
  }
};
