import express from "express";
import passport from "passport";
import { streamFileHandler } from "../../controllers/streamingController";

const router = express.Router();

router.get("/stream/:fileId",passport.authenticate("jwt", { session: false }),streamFileHandler)

export default router;