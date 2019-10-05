
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {

  static listAll = async (req: Request, res: Response) => {
  
  }
};

export default UserController;
