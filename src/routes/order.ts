import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import TestController from "../controllers/TestController";

const router = Router();

router.get("/get", TestController.get);
router.post("/post", TestController.post);

export default router;