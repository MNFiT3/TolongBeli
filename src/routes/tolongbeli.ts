import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import TolongBeliController from "../controllers/TolongBeliController";

const router = Router();

router.post('/grocery/list/', TolongBeliController.groceryList)
router.post('/checkout', [checkJwt], TolongBeliController.checkout)
router.post('/order', [checkJwt], TolongBeliController.myOrder)

export default router;