import express from "express";
import passport from "passport";
import { fileHistory } from "../../controllers/fileHistoryController";

const router = express.Router();

router.get("/file-history/:fileId",passport.authenticate("jwt",{session:false}),fileHistory)

export default router;