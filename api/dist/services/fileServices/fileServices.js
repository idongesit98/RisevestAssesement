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
exports.markFileUnsafe = exports.getAllUploads = exports.generateCloudinaryDownloadUrl = exports.saveFileRecordToDB = exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../../utils/config/cloudinary"));
const database_1 = __importDefault(require("../../utils/config/database"));
const redis_1 = require("../../utils/config/redis");
const uploadFileToCloudinary = (filePath_1, ...args_1) => __awaiter(void 0, [filePath_1, ...args_1], void 0, function* (filePath, folder = "cloud_backup_files") {
    try {
        const result = yield cloudinary_1.default.uploader.upload_large(filePath, {
            folder,
            resource_type: "auto",
            chunk_size: 6000000
        });
        return {
            code: 200,
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
                format: result.format,
                resourceType: result.resource_type
            },
            message: "File uploaded to Cloudinary successfully",
        };
    }
    catch (error) {
        console.error("Upload Error:", (error === null || error === void 0 ? void 0 : error.message) || error);
        return {
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to upload file",
            error: error,
        };
    }
});
exports.uploadFileToCloudinary = uploadFileToCloudinary;
const saveFileRecordToDB = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const saveUploadedFile = database_1.default.uploadedFiles.create({
        data: {
            filename: options.filename,
            key: options.key,
            size: options.size,
            url: options.url,
            publicId: options.publicId,
            resourceType: options.resourceType,
            userId: options.userId,
            folderId: options.folderId || null
        }
    });
    return saveUploadedFile;
});
exports.saveFileRecordToDB = saveFileRecordToDB;
const generateCloudinaryDownloadUrl = (publicId, resourceType) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `cloudinary:signed:${publicId}`;
    const cached = yield redis_1.redisClient.get(cacheKey);
    if (cached) {
        return {
            success: true,
            url: cached,
            fromCache: true
        };
    }
    try {
        const url = cloudinary_1.default.url(publicId, {
            resource_type: resourceType,
            secure: true,
            sign_url: true
        });
        yield redis_1.redisClient.setEx(cacheKey, 300, url); // Cache for 5 minutes
        return {
            success: true,
            url,
            fromCache: false,
        };
    }
    catch (error) {
        console.error("Cloudinary signed URL error:", error);
        return {
            success: false,
            message: error || "Failed to generate signed URL",
        };
    }
});
exports.generateCloudinaryDownloadUrl = generateCloudinaryDownloadUrl;
const getAllUploads = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUploads = yield database_1.default.uploadedFiles.findMany({});
        if (allUploads.length === 0) {
            return {
                code: 404,
                success: false,
                message: "No files available",
                data: null
            };
        }
        return {
            code: 200,
            success: true,
            message: "Files available",
            data: {
                allUploads
            }
        };
    }
    catch (error) {
        return {
            code: 500,
            success: false,
            message: error,
            data: null
        };
    }
});
exports.getAllUploads = getAllUploads;
const markFileUnsafe = (fileId, reason, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fileId) {
            return {
                code: 404,
                success: false,
                message: "File not found",
                data: null
            };
        }
        if (!reason || reason.trim() === "") {
            return {
                code: 400,
                success: false,
                message: "Reason for marking file unsafe is required"
            };
        }
        const updated = yield database_1.default.uploadedFiles.update({
            where: { id: fileId },
            data: { status: "UNSAFE" },
        });
        yield database_1.default.fileHistory.create({
            data: {
                fileId: fileId,
                action: "mark unsafe",
                id: userId,
                details: {
                    reason
                }
            }
        });
        return {
            code: 200,
            success: true,
            message: "File marked UNSAFE",
            data: { Unsafe: updated }
        };
    }
    catch (error) {
        return {
            code: 500,
            success: false,
            message: error,
            data: null
        };
    }
});
exports.markFileUnsafe = markFileUnsafe;
