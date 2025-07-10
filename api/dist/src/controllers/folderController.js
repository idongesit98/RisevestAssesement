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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFile = exports.listFolder = exports.getFolder = exports.createFolderHandler = void 0;
const folderServices_1 = require("../services/folderServices/folderServices");
const createFolderHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, parentFolderId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const createFolderResponse = yield (0, folderServices_1.createFolder)(name, userId, parentFolderId);
        res.status(createFolderResponse.code).json({ createFolderResponse });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.createFolderHandler = createFolderHandler;
const getFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderId = req.params.folderId;
        if (!folderId) {
            res.status(400).json({ success: false, message: "Folder ID is required" });
        }
        const folderResponse = yield (0, folderServices_1.getFolderById)(folderId);
        res.status(folderResponse.code).json(folderResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.getFolder = getFolder;
const listFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const allFolderResponse = yield (0, folderServices_1.listRootFolders)(userId);
        res.status(allFolderResponse.code).json(allFolderResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.listFolder = listFolder;
const moveFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fileId, folderId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!fileId || !folderId) {
            res.status(400).json({ success: false, message: "fileId and folderId are required" });
            return;
        }
        const fileResponse = yield (0, folderServices_1.moveFileToFolder)(fileId, folderId, userId);
        res.status(fileResponse.code).json(fileResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.moveFile = moveFile;
