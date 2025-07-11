import { UserRole } from "@prisma/client";
import prisma from "../../utils/config/database";
import { redisClient } from "../../utils/config/redis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const registerUser = async ({name,email,password,role}:UserParams) => {
    try {
        const existing = await prisma.user.findUnique({where:{email}})
        console.log(existing)
        if (existing) {
            return{
                code:400,
                success:false,
                message:"User already exist",
                data:null
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const normalizedRole = Object.values(UserRole).includes(role as UserRole) 
            ? (role as UserRole) : UserRole.USER;

        const newUser = await prisma.user.create({
            data:{ 
                name,
                email,
                password:hashedPassword,
                role:normalizedRole
            }
        })
        console.log("New user",newUser)

        const {password:_password, ...userWithoutPassword} = newUser;
        return{
            code:201,
            success:true,
            message:'User signed up successfully',
            data:{
                user:userWithoutPassword
            }
        }
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        return{
            code:500,
            success:false,
            data:null,
            message:errorMessage
        }
    }
}

export const loginUser = async (email:string,password:string) => {
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if (!user) {
            return{
                code:403,
                success:false,
                message:"No email found",
                data:null
            }
        }

        const correctPassword = await bcrypt.compare(password,user?.password!)
        const {password:_password, ...userWithoutPassword} = user;
        if (!correctPassword) {
            return{
                code:401,
                success:false,
                message:"Invalid Credentials",
                data:null
            };
        }
        
        const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET!,{expiresIn:"1d"})
        console.log('User Token',token);

        return{
            code:200,
            success:true,
            message:"User signed in successfully",
            data:{
                user:userWithoutPassword,
                token:token
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error Logging in User"
        return{
            code:500,
            success:false,
            data:null,
            message:errorMessage
        }
    }
}

export const logOutUser = async(sessionId:string) =>{
    try {
        const deleted = await redisClient.del(`session:${sessionId}`);
        if (deleted === 0) {
            return{
                code:404,
                success:false,
                message:"Session not found or already revoked",
                data:null
            };
        }

        return{
            code:200,
            success:true,
            message:"User logged out successfully",
            data:null
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Logout error"
        return{
            code:500,
            success:false,
            message:errorMessage,
            data:null
        };
    }
}

export const getAllUsers = async () => {
    try {
        const allUsers = await prisma.user.findMany({})

        if (!allUsers.length) {
            return{
                code:404,
                success:false,
                message:"No user avaiable",
                data:null
            }
        }

        return{
            code:200,
            success:true,
            message:"Users available",
            data:{
                Users:allUsers
            }
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error getting Users"
        return{
            code:500,
            success:false,
            data:null,
            message:errorMessage
        }
    }
}