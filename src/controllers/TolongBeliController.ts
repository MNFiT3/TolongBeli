import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Grocery } from "../entity/Grocery";

class TolongBeliController {

    static groceryList = async (req: Request, res: Response) => {
        const { option,  itemID } = req.body;

        var dynamicSQL = {
            
        };

        if(option == "byId"){
            if(!itemID){
                res.send("Missing item ID");
                return;
            }
            dynamicSQL['where'] = { id: itemID };
        }else if(option == "byStatus_unlisted"){
            dynamicSQL['where'] = { json: "Listed" };
        }else if(option == "byStatus_listed"){
            dynamicSQL['where'] = { status: "Unlisted" };
        }else if(option == "byPrice"){
            dynamicSQL['where'] = { status: "Unlisted" };
        }else{
            res.send("Missing option");
            return;
        }
        
        getRepository(Grocery).findAndCount(dynamicSQL).then(rs => {
            var collection = [];
            rs[0].forEach(e => {
                collection.push(e);
            });
            res.json({
                count: rs[1],
                lists: collection
            })
        })
    }

    static post = async (req: Request, res: Response) => {
        const data = req.body;
        console.log(data)
        res.json(data);
    }
};

export default TolongBeliController;
