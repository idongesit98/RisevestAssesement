import { Router } from "express";
import { allUsers, logout, signin, signup } from "../../controllers/authControllers";
import { authenticate } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/all",allUsers)
router.post("/login",signin)
router.post("/signup",signup)
//router.post("/logout",authenticate,logout)

export default router;