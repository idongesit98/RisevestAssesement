"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../../controllers/fileController");
const cloudinary_1 = require("../../utils/config/cloudinary");
const passport_1 = __importDefault(require("passport"));
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const router = express_1.default.Router();
router.get("/all", passport_1.default.authenticate("jwt", { session: false }), fileController_1.getAll);
router.get("/download/:publicId", passport_1.default.authenticate("jwt", { session: false }), fileController_1.downloadFileFromCloud);
router.post("/upload", passport_1.default.authenticate("jwt", { session: false }), adminMiddleware_1.isAdmin, cloudinary_1.upload.single("file"), fileController_1.uploadFile);
router.put("/unsafe/:fileId", passport_1.default.authenticate("jwt", { session: false }), fileController_1.markedFile);
exports.default = router;
