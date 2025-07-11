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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.logout = exports.signin = exports.signup = void 0;
const authService_1 = require("../services/authServices/authService");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const signin = (req, res, next) => {
    passport_1.default.authenticate('jwt', (error, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            res.status(500).json({ message: "Authentication error", error });
            return;
        }
        if (!user) {
            res.status(400).json({ message: info === null || info === void 0 ? void 0 : info.message });
            return;
        }
        try {
            //const {email} = user as User;
            const payload = req.body;
            const loginResponse = yield (0, authService_1.loginUser)(payload.email, payload.password);
            res.status(loginResponse.code).json(loginResponse);
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Unexpected error" });
        }
    }))(req, res, next);
};
exports.signin = signin;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer"))) {
            res.status(401).json({ success: false, message: "Authorization token missing or invalid" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!payload.sessionId) {
            res.status(400).json({ success: false, message: "Session ID missing in token" });
            return;
        }
        const logoutResponse = yield (0, authService_1.logOutUser)(payload.sessionId);
        res.status(logoutResponse.code).json(logoutResponse);
        return;
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Unexpected error" });
    }
});
exports.logout = logout;
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsersResponse = yield (0, authService_1.getAllUsers)();
    res.status(allUsersResponse.code).json(allUsersResponse);
});
exports.allUsers = allUsers;
