import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Deliverer } from "../entity/Deliverer";
import e = require("express");
import { Grocery } from "../entity/Grocery";

class AdminController {

    static viewDeliverer = async (req: Request, res: Response) => {
        const { option,  delivererID } = req.body;
        
        var dynamicSQL = {
            join: {
                alias: 'deliverer',
                leftJoinAndSelect: {
                    account: "deliverer.account"
                }
            }
        };

        if(option == "byId" && delivererID){
            dynamicSQL['where'] = { id: delivererID };
        }else if(option == "byApproval_false" && delivererID){
            dynamicSQL['where'] = { isApproved: false };
        }else if(option == "byApproval_true" && delivererID){
            dynamicSQL['where'] = { isApproved: true };
        }else{
            res.send("Missing option");
            return;
        }
        
        getRepository(Deliverer).findAndCount(dynamicSQL).then(rs => {
            var collection = [];
            rs[0].forEach(e => {
                delete e.account.password;
                collection.push(e);
            });
            res.json({
                count: rs[1],
                lists: collection
            })
        })
    }

    static validateDeliverer = async (req: Request, res: Response) => {
        const { delivererID, status } = req.body;

        if(!delivererID && !status){
            res.send("Missing required attributes");
            return;
        }

        getRepository(Deliverer).findOneOrFail({id: delivererID}).then(rs => {
            var updateDeliverer = rs;
            
            if(status == 'true'){
                updateDeliverer.isApproved = true;
            }else if( status == 'false'){
                updateDeliverer.isApproved = false;
            }else{
                res.send("Status is out of scope");
                return;
            }

            getRepository(Deliverer).save(updateDeliverer).then(result => {
                res.send("Success update deliverer status");
                return;
            });

        }).catch(err => {
            res.send("Deliverer id not found");
            return;
        })
    }

    static addGrocery = async (req: Request, res: Response) => {
        const { name, category, price, description } = req.body;

        if(!name && !price){
            res.send("Missing attributes");
            return;
        }

        var newGrocery = new Grocery();
        newGrocery.name = name;
        newGrocery.price = price.replace('.', '');
        newGrocery.json = {
            category: category || "",
            description: description || "",
            image: ""
        }

        getRepository(Grocery).save(newGrocery).then(rs => {
            res.send("Successfully added " + rs.name);
            return;
        }).catch(err => {
            res.send(err);
            return;
        })
    }
}

export default AdminController;
