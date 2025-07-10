"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const streamingController_1 = require("../../controllers/streamingController");
const router = express_1.default.Router();
router.get("/stream/:fileId", passport_1.default.authenticate("jwt", { session: false }), streamingController_1.streamFileHandler);
exports.default = router;
