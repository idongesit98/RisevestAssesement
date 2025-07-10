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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileHistory = void 0;
const database_1 = __importDefault(require("../../utils/config/database"));
const getFileHistory = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getHistory = yield database_1.default.fileHistory.findMany({
            where: { fileId },
            orderBy: { timeStamp: 'desc' }
        });
        if (!getHistory) {
            return {
                code: 404,
                success: false,
                message: "No history present",
                data: null
            };
        }
        return {
            code: 200,
            success: false,
            message: "File History found",
            data: { getHistory }
        };
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error finding History";
        return {
            code: 500,
            success: true,
            message: errorMessage
        };
    }
});
exports.getFileHistory = getFileHistory;
