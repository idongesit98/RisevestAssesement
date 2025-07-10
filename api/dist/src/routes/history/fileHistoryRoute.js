"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const fileHistoryController_1 = require("../../controllers/fileHistoryController");
const router = express_1.default.Router();
router.get("/file-history/:fileId", passport_1.default.authenticate("jwt", { session: false }), fileHistoryController_1.fileHistory);
exports.default = router;
