import { Router, Request, Response } from "express";
import user from "./user";
import account from "./account";
import admin from "./admin";
import tolongbeli from "./tolongbeli";

const routes = Router();

routes.use("/user", user);
routes.use("/account", account);
routes.use("/admin", admin);
routes.use("/tolongbeli", tolongbeli);

export default routes;
