import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Deliverer } from "../entity/Deliverer";
import e = require("express");

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
}

export default AdminController;
