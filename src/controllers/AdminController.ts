import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Deliverer } from "../entity/Deliverer";
import e = require("express");
import { Grocery } from "../entity/Grocery";

class AdminController {

    static viewDeliverer = async (req: Request, res: Response) => {
        const { option, delivererID } = req.body;

        var dynamicSQL = {
            join: {
                alias: 'deliverer',
                leftJoinAndSelect: {
                    account: "deliverer.account"
                }
            }
        };

        if (option == "byId") {
            if (!delivererID) {
                res.send("Missing deliverer ID");
                return;
            }
            dynamicSQL['where'] = { id: delivererID };
        } else if (option == "byApproval_false") {
            dynamicSQL['where'] = { isApproved: false };
        } else if (option == "byApproval_true") {
            dynamicSQL['where'] = { isApproved: true };
        } else {
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

        if (!delivererID && !status) {
            res.send("Missing required attributes");
            return;
        }

        getRepository(Deliverer).findOneOrFail({ id: delivererID }).then(rs => {
            var updateDeliverer = rs;

            if (status == 'approve') {
                updateDeliverer.isApproved = true;
            } else if (status == 'reject') {
                updateDeliverer.isApproved = false;
            } else {
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

        if (!name && !price) {
            res.send("Missing attributes");
            return;
        }

        const groceryRepo = getRepository(Grocery);
        groceryRepo.findOneOrFail({ name: name }).then(rs => {
            res.send("Item with the same name is already in database")
        }).catch(err => {

            var newGrocery = new Grocery();
            newGrocery.name = name;
            newGrocery.price = price.replace('.', '');
            newGrocery.json = {
                status: "Listed",
                category: category || "",
                description: description || "",
                image: ""
            }

            groceryRepo.save(newGrocery).then(rs => {
                res.send("Successfully added " + rs.name);
                return;
            }).catch(err => {
                res.send(err);
                return;
            })
        })
    }

    static updateGrocery = async (req: Request, res: Response) => {
        const { itemID, action, itemName, itemPrice, itemJson } = req.body;

        if (!(itemID && action)) {
            res.send("Missing required attribute(s)");
            return;
        }

        getRepository(Grocery).findOneOrFail({ id: itemID }).then(item => {

            if (action == "delete") {
                item.json.status = "Unlisted"
            } else if (action == "restore") {
                item.json.status = "Listed"
            } else if (action == "update") {
                if (!(itemName && itemPrice)) {
                    res.send("Missing update attributes");
                    return;
                }

                //Copy original object.
                const oriJson = JSON.parse(JSON.stringify(item.json));

                item.name = itemName;
                item.price = itemPrice;
                item.json = {
                    status: itemJson.status || oriJson.status,
                    category: itemJson.category || oriJson.category,
                    description: itemJson.description || oriJson.description,
                    image: itemJson.image || oriJson.image
                }
            } else {
                res.send("Action out of scope");
                return;
            }

            getRepository(Grocery).save(item).then(rs => {
                res.send("Edit grocery success");
                return;
            }).catch(err => {
                res.send(err);
                return;
            })

        }).catch(err => {
            res.send(err);
            return;
        })
    }
}

export default AdminController;
