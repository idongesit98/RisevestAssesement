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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.logOutUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../utils/config/database"));
const redis_1 = require("../../utils/config/redis");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, role }) {
    try {
        const existing = yield database_1.default.user.findUnique({ where: { email } });
        console.log(existing);
        if (existing) {
            return {
                code: 400,
                success: false,
                message: "User already exist",
                data: null
            };
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const normalizedRole = Object.values(client_1.UserRole).includes(role)
            ? role : client_1.UserRole.USER;
        const newUser = yield database_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: normalizedRole
            }
        });
        console.log("New user", newUser);
        const { password: _password } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        return {
            code: 201,
            success: true,
            message: 'User signed up successfully',
            data: {
                user: userWithoutPassword
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        return {
            code: 500,
            success: false,
            data: null,
            message: errorMessage
        };
    }
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return {
                code: 403,
                success: false,
                message: "No email found",
                data: null
            };
        }
        const correctPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        const { password: _password } = user, userWithoutPassword = __rest(user, ["password"]);
        if (!correctPassword) {
            return {
                code: 401,
                success: false,
                message: "Invalid Credentials",
                data: null
            };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log('User Token', token);
        return {
            code: 200,
            success: true,
            message: "User signed in successfully",
            data: {
                user: userWithoutPassword,
                token: token
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error Logging in User";
        return {
            code: 500,
            success: false,
            data: null,
            message: errorMessage
        };
    }
});
exports.loginUser = loginUser;
const logOutUser = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield redis_1.redisClient.del(`session:${sessionId}`);
        if (deleted === 0) {
            return {
                code: 404,
                success: false,
                message: "Session not found or already revoked",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "User logged out successfully",
            data: null
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Logout error";
        return {
            code: 500,
            success: false,
            message: errorMessage,
            data: null
        };
    }
});
exports.logOutUser = logOutUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield database_1.default.user.findMany({});
        if (!allUsers.length) {
            return {
                code: 404,
                success: false,
                message: "No user avaiable",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Users available",
            data: {
                Users: allUsers
            }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error getting Users";
        return {
            code: 500,
            success: false,
            data: null,
            message: errorMessage
        };
    }
});
exports.getAllUsers = getAllUsers;
