"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folderController_1 = require("../../controllers/folderController");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/folders/:folderId", passport_1.default.authenticate("jwt", { session: false }), folderController_1.getFolder);
router.get("/allfolders", passport_1.default.authenticate("jwt", { session: false }), folderController_1.listFolder);
router.post("/create", passport_1.default.authenticate("jwt", { session: false }), folderController_1.createFolderHandler);
router.put("/move", passport_1.default.authenticate("jwt", { session: false }), folderController_1.moveFile);
exports.default = router;
