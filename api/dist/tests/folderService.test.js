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
const folderServices_1 = require("../src/services/folderServices/folderServices");
jest.mock('../src/utils/config/database', () => prisma_1.default);
beforeEach(() => {
    jest.clearAllMocks();
});
describe('createFolder', () => {
    describe('createFolder', () => {
        it('should return 400 if folder already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.default.folder.findUnique.mockResolvedValue({ id: 'existing-id' });
            const createResponse = yield (0, folderServices_1.createFolder)('Test', 'user-id', 'folder-id');
            expect(createResponse.code).toBe(400);
            expect(createResponse.message).toBe('User already exist');
        }));
        it('should create and return a new folder', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            prisma_1.default.folder.findUnique.mockResolvedValue(null);
            prisma_1.default.folder.create.mockResolvedValue({ id: 'new-folder-id', name: 'Test' });
            const newResponse = yield (0, folderServices_1.createFolder)('Test', 'user-id', 'folder-id');
            expect(newResponse.code).toBe(201);
            expect(newResponse.message).toBe('Folder created successfully');
            expect((_a = newResponse.data) === null || _a === void 0 ? void 0 : _a.newFolder.id).toBe('new-folder-id');
        }));
    });
    describe('getFolderById', () => {
        it('should return 404 if folder is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.default.folder.findUnique.mockResolvedValue(null);
            const getResponse = yield (0, folderServices_1.getFolderById)('folder-id');
            expect(getResponse.code).toBe(404);
            expect(getResponse.message).toBe('Folder not found');
        }));
        it('should return folder data if found', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            prisma_1.default.folder.findUnique.mockResolvedValue({ id: 'folder-id', subfolders: [], uploads: [] });
            const foundResponse = yield (0, folderServices_1.getFolderById)('folder-id');
            expect(foundResponse.code).toBe(200);
            expect((_a = foundResponse.data) === null || _a === void 0 ? void 0 : _a.getFolderById.id).toBe('folder-id');
        }));
    });
    describe('listRootFolders', () => {
        it('should return 200 with folders', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            prisma_1.default.folder.findMany.mockResolvedValue([{ id: 'folder-1' }]);
            const listResponse = yield (0, folderServices_1.listRootFolders)('user-id');
            expect(listResponse.code).toBe(200);
            expect((_a = listResponse.data) === null || _a === void 0 ? void 0 : _a.getAllFolders.length).toBe(1);
        }));
        it('should return 404 if no folders found', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_1.default.folder.findMany.mockResolvedValue([]);
            const notFoundResponse = yield (0, folderServices_1.listRootFolders)('user-id');
            expect(notFoundResponse.code).toBe(404);
        }));
    });
    describe('moveFileToFolder', () => {
        it('should return 400 if any param is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const moveResponse = yield (0, folderServices_1.moveFileToFolder)('', 'folderId', 'userId');
            expect(moveResponse.code).toBe(400);
        }));
        it('should move file and return updatedFile', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            prisma_1.default.uploadedFiles.update.mockResolvedValue({ id: 'file-id', folderId: 'folder-id' });
            prisma_1.default.fileHistory.create.mockResolvedValue({});
            const updateResponse = yield (0, folderServices_1.moveFileToFolder)('file-id', 'folder-id', 'user-id');
            expect(updateResponse.code).toBe(200);
            expect(updateResponse.message).toBe('File moved successfully');
            expect((_a = updateResponse.data) === null || _a === void 0 ? void 0 : _a.updatedFile.folderId).toBe('folder-id');
        }));
    });
});
