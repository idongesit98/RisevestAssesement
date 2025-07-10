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
const prisma_1 = __importDefault(require("./mocks/prisma"));
const authService_1 = require("../src/services/authServices/authService");
const bcrypt_1 = __importDefault(require("bcrypt"));
//Mocks
jest.mock('../src/utils/config/database', () => prisma_1.default);
//mock other library
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashed_password')),
    compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fake_jwt_token')
}));
describe('Auth Service: registerUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return 400 if user already exist', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.user.findUnique.mockResolvedValue({ email: 'robson@gmail.com' });
        const result = yield (0, authService_1.registerUser)({
            name: "Harry Da Souza",
            email: "robson@gmail.com",
            password: 'secretoo',
            role: 'ADMIN'
        });
        expect(result.code).toBe(400);
        expect(result.message).toBe('User already exist');
    }));
    it('should return 201 if user is created', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        prisma_1.default.user.findUnique.mockResolvedValue(null);
        prisma_1.default.user.create.mockResolvedValue({
            id: '1',
            name: 'Kayode',
            email: 'kayode@gmail.com',
            password: 'hashed_password',
            role: 'ADMIN'
        });
        const result = yield (0, authService_1.registerUser)({
            name: 'Kayode',
            email: 'kayode@gmail.com',
            password: 'secret',
            role: 'ADMIN'
        });
        expect(result.code).toBe(201);
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.user.email).toBe('kayode@gmail.com');
    }));
});
describe('Auth Service - loginUser', () => {
    it('should return 403 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.user.findUnique.mockResolvedValue(null);
        const loginResponse = yield (0, authService_1.loginUser)('slaw@outlook.com', 'adrenaline');
        expect(loginResponse.code).toBe(403);
        expect(loginResponse.success).toBe(false);
        expect(loginResponse.message).toBe('No email found');
    }));
    it('should return 401 if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.user.findUnique.mockResolvedValue({
            id: '1',
            email: 'slaw@outlook.com',
            password: 'hashed_password'
        });
        bcrypt_1.default.compare.mockResolvedValue(false);
        const loginResult = yield (0, authService_1.loginUser)('slaw@outlook.com', 'wrongpassword');
        expect(loginResult.code).toBe(401);
        expect(loginResult.success).toBe(false);
        expect(loginResult.message).toBe('Invalid Credentials');
    }));
    it('should return 200 and a token if login is successful', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        prisma_1.default.user.findUnique.mockResolvedValue({
            id: '1',
            email: 'kayode@gmail.com',
            password: 'hashed_password'
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        const loginresult = yield (0, authService_1.loginUser)('kayode@gmail.com', 'correctpassword');
        expect(loginresult.code).toBe(200);
        expect(loginresult.success).toBe(true);
        expect((_a = loginresult.data) === null || _a === void 0 ? void 0 : _a.token).toBe('fake_jwt_token');
    }));
});
describe('Auth Service - getAllUsers', () => {
    it('should return 404 if no users', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.user.findMany.mockResolvedValue([]);
        const allUserResult = yield (0, authService_1.getAllUsers)();
        expect(allUserResult.code).toBe(404);
        expect(allUserResult.success).toBe(false);
        expect(allUserResult.message).toBe('No user avaiable');
    }));
    it('should return 200 and users if found', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        prisma_1.default.user.findMany.mockResolvedValue([
            { id: '1', name: 'Kayode', email: 'kayode@gmail.com' }
        ]);
        const userResult = yield (0, authService_1.getAllUsers)();
        expect(userResult.code).toBe(200);
        expect(userResult.success).toBe(true);
        expect((_a = userResult.data) === null || _a === void 0 ? void 0 : _a.Users.length).toBeGreaterThan(0);
    }));
});
