"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.login = exports.signup = void 0;
const authService_1 = require("../services/authServices/authService");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const signupResponse = yield (0, authService_1.registerUser)({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role
    });
    res.status(signupResponse.code).json(signupResponse);
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loginResponse = yield (0, authService_1.loginUser)(email, password);
        res.status(200).json(loginResponse);
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});
exports.login = login;
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
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsersResponse = yield (0, authService_1.getAllUsers)();
    res.status(allUsersResponse.code).json(allUsersResponse);
});
exports.allUsers = allUsers;
