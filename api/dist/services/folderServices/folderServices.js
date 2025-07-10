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
exports.moveFileToFolder = exports.listRootFolders = exports.getFolderById = exports.createFolder = void 0;
const database_1 = __importDefault(require("../../utils/config/database"));
const createFolder = (name, userId, parentFolderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield database_1.default.folder.findUnique({ where: { id: userId } });
        if (existing) {
            return {
                code: 400,
                success: false,
                message: "User already exist",
                data: null
            };
        }
        const newFolder = yield database_1.default.folder.create({
            data: {
                name,
                userId,
                parentFolderId: parentFolderId || null
            }
        });
        return {
            code: 201,
            success: true,
            message: "Folder created successfully",
            data: { newFolder }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.createFolder = createFolder;
const getFolderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getFolderById = yield database_1.default.folder.findUnique({
            where: { id },
            include: {
                subfolders: true,
                uploads: true
            }
        });
        if (!getFolderById) {
            return {
                code: 404,
                success: true,
                message: "Folder not found",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Folder found",
            data: { getFolderById }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user";
        console.error(errorMessage);
        return {
            code: 500,
            success: false,
            message: errorMessage
        };
    }
});
exports.getFolderById = getFolderById;
const listRootFolders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllFolders = yield database_1.default.folder.findMany({
            where: { userId, parentFolderId: null },
            include: { subfolders: true, uploads: true }
        });
        if (!getAllFolders) {
            return {
                code: 404,
                success: true,
                message: "Folder not found",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Folder found",
            data: { getAllFolders }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error finding Folders";
        console.error(errorMessage);
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.listRootFolders = listRootFolders;
const moveFileToFolder = (fileId, folderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fileId || !folderId || !userId) {
        return {
            code: 400,
            success: false,
            message: "fileId, folderId, and userId are required",
            data: null
        };
    }
    try {
        const updatedFile = yield database_1.default.uploadedFiles.update({
            where: { id: fileId },
            data: { folderId }
        });
        yield database_1.default.fileHistory.create({
            data: {
                fileId,
                action: "move",
                userId,
                details: { newFolderId: folderId }
            }
        });
        return {
            code: 200,
            success: true,
            message: "File moved successfully",
            data: { updatedFile }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error moving folders";
        console.error(errorMessage);
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.moveFileToFolder = moveFileToFolder;
