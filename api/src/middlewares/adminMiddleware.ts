import { Request,Response,NextFunction } from "express";

export const isAdmin = (req:Request,res:Response,next:NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: "Access denied not an Admin" });
    }
    next();
}