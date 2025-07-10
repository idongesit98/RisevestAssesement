import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../utils/config/redis";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Missing or invalid token" });
        return
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Check if session is valid
        const sessionData = await redisClient.get(`session:${payload.sessionId}`);
        if (!sessionData) {
            res.status(401).json({ success: false, message: "Session invalid or expired" });
            return;
        }

        req.user = payload; // Attach to request
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
};

export const isAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};