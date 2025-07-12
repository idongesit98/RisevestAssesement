"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamingController_1 = require("../../controllers/streamingController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/stream/:fileId", authMiddleware_1.authenticate, streamingController_1.streamFileHandler);
exports.default = router;
