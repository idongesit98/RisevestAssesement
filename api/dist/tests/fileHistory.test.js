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
const fileHistoryService_1 = require("../src/services/fileHistory/fileHistoryService");
jest.mock('../src/utils/config/database', () => prisma_1.default);
describe('getFileHistory', () => {
    const fileId = 'file-id-123';
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 200 and history data if the history exists', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mockHistory = [
            { id: '1', action: 'upload', fileId, timeStamp: new Date() }
        ];
        prisma_1.default.fileHistory.findMany.mockResolvedValue(mockHistory);
        const res = yield (0, fileHistoryService_1.getFileHistory)(fileId);
        expect(res.code).toBe(200);
        expect(res.success).toBe(true);
        expect((_a = res.data) === null || _a === void 0 ? void 0 : _a.getHistory).toEqual(mockHistory);
        expect(prisma_1.default.fileHistory.findMany).toHaveBeenCalledWith({
            where: { fileId },
            orderBy: { timeStamp: 'desc' }
        });
    }));
    it('should return 404 if no history is found', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.fileHistory.findMany.mockResolvedValue([]);
        const res = yield (0, fileHistoryService_1.getFileHistory)(fileId);
        expect(res.code).toBe(404);
        expect(res.success).toBe(false);
        expect(res.message).toBe('No history present');
    }));
    it('should return 500 if prismaDB has an error', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.fileHistory.findMany.mockRejectedValue(new Error('Database Error'));
        const res = yield (0, fileHistoryService_1.getFileHistory)(fileId);
        expect(res.code).toBe(500);
        expect(res.success).toBe(false);
        expect(res.message).toBe('Database Error');
    }));
});
