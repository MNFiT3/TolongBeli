import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import TestController from "../controllers/TestController";

const router = Router();

router.get("/", TestController.test);

export default router;