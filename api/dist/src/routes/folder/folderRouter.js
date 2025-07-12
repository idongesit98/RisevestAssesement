"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folderController_1 = require("../../controllers/folderController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/folders/:folderId", authMiddleware_1.authenticate, folderController_1.getFolder);
router.get("/allfolders", authMiddleware_1.authenticate, folderController_1.listFolder);
router.post("/create", authMiddleware_1.authenticate, folderController_1.createFolderHandler);
router.put("/move", authMiddleware_1.authenticate, folderController_1.moveFile);
exports.default = router;
