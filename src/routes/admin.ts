import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import AdminController from "../controllers/AdminController";

const router = Router();

router.post("/grocery/add", AdminController.addGrocery);
router.post("/grocery/update", AdminController.updateGrocery);

router.post("/deliverer/view/", AdminController.viewDeliverer);

router.post("/deliverer/validate", AdminController.validateDeliverer);

router.post("/deliverer/remove");
router.post("/grocery/remove");

export default router;