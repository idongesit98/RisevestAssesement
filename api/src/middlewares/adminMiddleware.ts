import { Request,Response,NextFunction } from "express";

export const isAdmin = (req:Request,res:Response,next:NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({success:false,message:"Access denied not an Admin"});
        return;
    }
    next();
}