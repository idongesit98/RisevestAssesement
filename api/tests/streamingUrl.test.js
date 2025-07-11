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
const cloudinary_1 = __importDefault(require("./mocks/cloudinary"));
const streamingService_1 = require("../src/services/streamingServices/streamingService");
jest.mock('../src/utils/config/database', () => prisma_1.default);
jest.mock('cloudinary', () => ({ v2: cloudinary_1.default }));
describe('getStreamingUrl', () => {
    const fileId = 'file-772';
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 200 and streaming URL if file is safe', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.uploadedFiles.findUnique.mockResolvedValue({
            id: fileId,
            publicId: 'cloudinary-public-id',
            resourceType: 'video',
            status: 'SAFE'
        });
        cloudinary_1.default.url.mockReturnValue('https://mocked-streaming-url.com');
        const streamResponse = yield (0, streamingService_1.getStreamingUrl)(fileId);
        expect(streamResponse.code).toBe(200);
        expect(streamResponse.success).toBe(true);
        expect(streamResponse.streamUrl).toBe('https://mocked-streaming-url.com');
        expect(cloudinary_1.default.url).toHaveBeenCalledWith('cloudinary-public-id', expect.objectContaining({
            resource_type: 'video',
            secure: true,
            sign_url: true,
            format: 'mp4',
            transformation: expect.any(Array)
        }));
    }));
    it('should return 404 if file is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.uploadedFiles.findUnique.mockResolvedValue(null);
        const noStreaming = yield (0, streamingService_1.getStreamingUrl)(fileId);
        expect(noStreaming.code).toBe(404);
        expect(noStreaming.success).toBe(false);
        expect(noStreaming.message).toBe('File not found or marked as unsafe');
    }));
    it('should return 404 if file is marked as UNSAFE', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.uploadedFiles.findUnique.mockResolvedValue({
            id: fileId,
            status: 'UNSAFE'
        });
        const dontStream = yield (0, streamingService_1.getStreamingUrl)(fileId);
        expect(dontStream.code).toBe(404);
        expect(dontStream.success).toBe(false);
        expect(dontStream.message).toBe('File not found or marked as unsafe');
    }));
});
