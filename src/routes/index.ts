import { Router, Request, Response } from "express";
import user from "./user";
import test from "./test";
import account from "./account";

const routes = Router();

routes.use("/user", user);
routes.use("/test", test);
routes.use("/account", account);

export default routes;
