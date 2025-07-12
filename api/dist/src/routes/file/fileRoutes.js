"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../../controllers/fileController");
const cloudinary_1 = require("../../utils/config/cloudinary");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const router = express_1.default.Router();
router.get("/all", fileController_1.getAll);
router.get("/download/:publicId", authMiddleware_1.authenticate, fileController_1.downloadFileFromCloud);
router.post("/upload", authMiddleware_1.authenticate, adminMiddleware_1.isAdmin, cloudinary_1.upload.single("file"), fileController_1.uploadFile);
router.put("/unsafe/:fileId", authMiddleware_1.authenticate, fileController_1.markedFile);
exports.default = router;
