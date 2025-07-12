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
const redis_1 = __importDefault(require("./mocks/redis"));
const fileServices_1 = require("../src/services/fileServices/fileServices");
jest.mock('../src/utils/config/database', () => prisma_1.default);
jest.mock('cloudinary', () => ({ v2: cloudinary_1.default }));
jest.mock('../src/utils/config/redis', () => ({
    redisClient: redis_1.default
}));
beforeEach(() => {
    jest.clearAllMocks();
});
describe('uploadFileToCloudinary', () => {
    it('should upload and return success,if successful', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        cloudinary_1.default.uploader.upload_large.mockResolvedValue({
            public_id: 'file123',
            resource_type: 'image',
            format: 'jpg',
            secure_url: 'https://cdn.cloudinary.com/file.jpg',
            bytes: 98213
        });
        const uploadResponse = yield (0, fileServices_1.uploadFileToCloudinary)('fake/path/file.jpg');
        expect(uploadResponse.success).toBe(true);
        expect((_a = uploadResponse.data) === null || _a === void 0 ? void 0 : _a.publicId).toBe('file123');
    }));
    it('should return an error if upload fails', () => __awaiter(void 0, void 0, void 0, function* () {
        cloudinary_1.default.uploader.upload_large.mockRejectedValue(new Error('Upload failed'));
        const uploadErrorResponse = yield (0, fileServices_1.uploadFileToCloudinary)('bad/file');
        expect(uploadErrorResponse.success).toBe(false);
        expect(uploadErrorResponse.message).toBe('Upload failed');
    }));
});
describe('saveFileRecordToDB', () => {
    it('should call prisma.uploadedFiles.create', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.uploadedFiles.create.mockResolvedValue({ id: 'file-id' });
        const file = yield (0, fileServices_1.saveFileRecordToDB)({
            filename: 'file.jpg',
            key: 'file123',
            size: 3421,
            url: 'https://cdn.cloudinary.com/file.jpg',
            publicId: 'pub3290',
            resourceType: 'image',
            userId: 'user-id',
            folderId: 'folder-id'
        });
        expect(file.id).toBe('file-id');
        expect(prisma_1.default.uploadedFiles.create).toHaveBeenCalled();
    }));
});
describe('generateCloudinaryDownloadUrl', () => {
    it('should return cached URL', () => __awaiter(void 0, void 0, void 0, function* () {
        redis_1.default.get.mockResolvedValue('https://cached-url.com');
        const generateResponse = yield (0, fileServices_1.generateCloudinaryDownloadUrl)('publicId', 'image');
        expect(generateResponse.fromCache).toBe(true);
        expect(generateResponse.url).toBe('https://cached-url.com');
    }));
    it('should generate and cache new signed URL', () => __awaiter(void 0, void 0, void 0, function* () {
        redis_1.default.get.mockResolvedValue(null);
        cloudinary_1.default.url.mockReturnValue('https://signed-url.com');
        redis_1.default.setEx.mockResolvedValue('OK');
        const cacheResponse = yield (0, fileServices_1.generateCloudinaryDownloadUrl)('publicId', 'image');
        expect(cacheResponse.url).toBe('https://signed-url.com');
        expect(cacheResponse.fromCache).toBe(false);
    }));
});
describe('getAllUploads', () => {
    it('should return 404 if no file found', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.default.uploadedFiles.findMany.mockResolvedValue([]);
        const allResponse = yield (0, fileServices_1.getAllUploads)();
        expect(allResponse.code).toBe(404);
    }));
    it('should return all uploads if available', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        prisma_1.default.uploadedFiles.findMany.mockResolvedValue([{ id: 'file1' }]);
        const availableResponse = yield (0, fileServices_1.getAllUploads)();
        expect(availableResponse.code).toBe(200);
        expect((_a = availableResponse.data) === null || _a === void 0 ? void 0 : _a.allUploads.length).toBe(1);
    }));
});
describe('markFileUnsafe', () => {
    it('should return 404 if fileId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const unsafeResponse = yield (0, fileServices_1.markFileUnsafe)('', 'reason', 'user-id');
        expect(unsafeResponse.code).toBe(404);
    }));
    it('should return 400 if reason is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const missingResponse = yield (0, fileServices_1.markFileUnsafe)('file-id', '', 'user-id');
        expect(missingResponse.code).toBe(400);
    }));
    it('should mark file as unsafe and add history to database', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        prisma_1.default.uploadedFiles.update.mockResolvedValue({ id: 'file-id', status: 'UNSAFE' });
        prisma_1.default.fileHistory.create.mockResolvedValue({});
        const historyResponse = yield (0, fileServices_1.markFileUnsafe)('file-id', 'malware found', 'user-id');
        expect(historyResponse.code).toBe(200);
        expect((_a = historyResponse.data) === null || _a === void 0 ? void 0 : _a.Unsafe.status).toBe('UNSAFE');
        expect(prisma_1.default.fileHistory.create).toHaveBeenCalled();
    }));
});
