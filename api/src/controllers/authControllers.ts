import { Request,Response,NextFunction } from "express";
import { registerUser,loginUser, getAllUsers} from "../services/authServices/authService";

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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const loginResponse = await loginUser(email, password);
        res.status(200).json(loginResponse);
    } catch (error:any) {
        res.status(400).send({success:false,message:error.message})
    }
};

// export const signin = (req:Request,res:Response,next:NextFunction) =>{
//     passport.authenticate('local', { session: false }, async(error:any,user:User | false,info:{message:string}) => {

//         if (error) {
//             res.status(500).json({message:"Authentication error",error});
//             return;
//         }
//         if(!user){
//             res.status(400).json({message:info?.message});
//             return
//         }

//         try {
//             //const {email} = user as User;
//             const payload = req.body
//             const loginResponse = await loginUser(payload.email,payload.password)
//             res.status(loginResponse.code).json(loginResponse)
//             return
//         } catch (error:any) {
//             res.status(500).json({message:error.message || "Unexpected error"})
//         }
//     })(req,res,next)
// }

export const allUsers = async (req:Request,res:Response) => {
    const allUsersResponse = await getAllUsers()
    res.status(allUsersResponse.code).json(allUsersResponse)
};
