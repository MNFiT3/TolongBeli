
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

class TestController {

    static test = async (req: Request, res: Response) => {
        const data = req.params;
        console.log("asdads")
        res.send("data");
    }
};

export default TestController;
