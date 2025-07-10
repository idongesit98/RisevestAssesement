import { Request,Response,NextFunction } from "express";
import { registerUser,loginUser, getAllUsers, logOutUser } from "../services/authServices/authService";
import passport from "passport";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const signup = async(req:Request,res:Response) =>{
    const payload = req.body
    const signupResponse = await registerUser({
        name:payload.name,
        email:payload.email,
        password:payload.password,
        role:payload.role
    })
    res.status(signupResponse.code).json(signupResponse)
}

export const signin = (req:Request,res:Response,next:NextFunction) =>{
    passport.authenticate('jwt', async(error:any,user:User | false,info:{message:string}) => {

        if (error) {
            res.status(500).json({message:"Authentication error",error});
            return;
        }
        if(!user){
            res.status(400).json({message:info?.message});
            return
        }

        try {
            //const {email} = user as User;
            const payload = req.body
            const loginResponse = await loginUser(payload.email,payload.password)
            res.status(loginResponse.code).json(loginResponse)
            return
        } catch (error:any) {
            res.status(500).json({message:error.message || "Unexpected error"})
        }
    })(req,res,next)
}

export const logout = async(req:Request,res:Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader?.startsWith("Bearer")) {
            res.status(401).json({success:false,message:"Authorization token missing or invalid"})
            return;
        }

        const token = authHeader.split(" ")[1];
        const payload:any = jwt.verify(token,process.env.JWT_SECRET!);

        if (!payload.sessionId) {
            res.status(400).json({success:false,message:"Session ID missing in token"})
            return;
        }

        const logoutResponse = await logOutUser(payload.sessionId);
        res.status(logoutResponse.code).json(logoutResponse);
        return;
    } catch (error:any) {
        res.status(500).json({message:error.message || "Unexpected error"})
    }
}

export const allUsers = async (req:Request,res:Response) => {
    const allUsersResponse = await getAllUsers()
    res.status(allUsersResponse.code).json(allUsersResponse)
};
