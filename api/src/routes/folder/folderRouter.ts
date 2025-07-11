import express from "express";
import { createFolderHandler, getFolder, listFolder, moveFile } from "../../controllers/folderController";
import passport from "passport";

const router = express.Router();

router.get("/folders/:folderId",passport.authenticate("jwt",{session:false}),getFolder);
router.get("/allfolders",passport.authenticate("jwt",{session:false}),listFolder)
router.post("/create",passport.authenticate("jwt",{session:false}),createFolderHandler)
router.put("/move",passport.authenticate("jwt",{session:false}),moveFile)

export default router;