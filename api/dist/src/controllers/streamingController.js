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
exports.streamFileHandler = void 0;
const streamingService_1 = require("../services/streamingServices/streamingService");
const streamFileHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.fileId;
        if (!fileId) {
            res.status(404).json({ success: false, message: "FileID not found please add a valid ID" });
            return;
        }
        const streamingResponse = yield (0, streamingService_1.getStreamingUrl)(fileId);
        res.status(streamingResponse.code).json(streamingResponse);
    }
    catch (error) {
        console.error("Streaming File error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
        return;
    }
});
exports.streamFileHandler = streamFileHandler;
