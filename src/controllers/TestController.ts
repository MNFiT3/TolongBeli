import { Request, Response } from "express";
import { getRepository } from "typeorm";

class TestController {

    static get = async (req: Request, res: Response) => {
        const data = req.params;
        console.log(data)
        res.json(data);
    }

    static post = async (req: Request, res: Response) => {
        const data = req.body;
        console.log(data)
        res.json(data);
    }
};

export default TestController;
