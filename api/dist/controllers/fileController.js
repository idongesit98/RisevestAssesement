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
exports.markedFile = exports.getAll = exports.downloadFileFromCloud = exports.uploadFile = void 0;
const fileServices_1 = require("../services/fileServices/fileServices");
const database_1 = __importDefault(require("../utils/config/database"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
    }
    console.log(req.file);
    //  if (!req.user) {
    //     res.status(401).json({success:false,message:"Unauthorized"})
    //     return;
    // }np
    const filePath = req.file.path;
    console.log(filePath);
    const result = yield (0, fileServices_1.uploadFileToCloudinary)(filePath);
    if (!result.success || !result.data) {
        res.status(500).json({
            success: false,
            message: result.message || "Upload failed",
            error: result.error instanceof Error ? result.error.message : JSON.stringify(result.error)
        });
        return;
    }
    const { url, publicId, size, resourceType } = result.data;
    const savedFile = yield (0, fileServices_1.saveFileRecordToDB)({
        filename: req.file.originalname,
        key: req.file.filename,
        size,
        url,
        publicId,
        resourceType,
        userId: req.user.id,
        folderId: req.body.folderId
    });
    res.status(200).json({ success: true, data: savedFile });
    return;
});
exports.uploadFile = uploadFile;
const downloadFileFromCloud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encodedId = req.params.publicId;
        const publicId = decodeURIComponent(encodedId).trim();
        if (!publicId) {
            res.status(400).json({ success: false, message: "Missing PublicId" });
            return;
        }
        const file = yield database_1.default.uploadedFiles.findFirst({
            where: { publicId },
        });
        console.log("File returned:", file);
        if (!file) {
            res.status(404).json({ success: false, message: "File not found" });
            return;
        }
        const result = yield (0, fileServices_1.generateCloudinaryDownloadUrl)(publicId, file.resourceType);
        if (!result.success) {
            res.status(500).json(result);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
        return;
    }
});
exports.downloadFileFromCloud = downloadFileFromCloud;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadsResponse = yield (0, fileServices_1.getAllUploads)();
    res.status(uploadsResponse.code).json(uploadsResponse);
});
exports.getAll = getAll;
const markedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const fileId = req.params.fileId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { reason } = req.body;
        if (!fileId) {
            res.status(404).json({ success: false, message: "No FileId present, please provide an available fileID" });
        }
        const markResponse = yield (0, fileServices_1.markFileUnsafe)(fileId, reason, userId);
        res.status(markResponse.code).json(markResponse);
    }
    catch (error) {
        console.error("Marked File error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
        return;
    }
});
exports.markedFile = markedFile;
