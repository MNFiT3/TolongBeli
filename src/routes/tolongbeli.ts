import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import TolongBeliController from "../controllers/TolongBeliController";

const router = Router();

router.post('/grocery/list/', TolongBeliController.groceryList);
router.post('/checkout', [checkJwt],TolongBeliController.checkout)

export default router;