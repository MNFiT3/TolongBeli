import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import AdminController from "../controllers/AdminController";

const router = Router();

router.post("/add/grocery", AdminController.addGrocery)

router.post("/view/deliverer/", AdminController.viewDeliverer);

router.post("/validate/deliverer", AdminController.validateDeliverer);

router.post("/remove/deliverer");
router.post("/remove/grocery");

export default router;