import { Router} from "express";
import { allUsers,signup,login} from "../../controllers/authControllers";
import { authenticate } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/signup",signup)
router.post("/login",login);


router.get("/all",authenticate,allUsers)

export default router;