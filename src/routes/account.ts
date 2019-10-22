import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import AccountController from "../controllers/AccountController";

const router = Router();

router.post("/register", AccountController.register);
router.post("/login", AccountController.login);
router.post("/approve");
router.post("/remove");

export default router;