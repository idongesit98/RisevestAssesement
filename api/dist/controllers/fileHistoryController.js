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
exports.fileHistory = void 0;
const fileHistory_1 = require("../services/fileHistory/fileHistory");
const fileHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.fileId;
        const fileResponse = yield (0, fileHistory_1.getFileHistory)(fileId);
        res.status(fileResponse.code).json(fileResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.fileHistory = fileHistory;
