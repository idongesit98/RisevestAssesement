"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileHistoryController_1 = require("../../controllers/fileHistoryController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/file-history/:fileId", authMiddleware_1.authenticate, fileHistoryController_1.fileHistory);
exports.default = router;
