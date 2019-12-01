import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Grocery } from "../entity/Grocery";
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { ItemList } from "../entity/ItemList";
import { Account } from "../entity/Account";

class TolongBeliController {

    static groceryList = async (req: Request, res: Response) => {
        const { option, itemID } = req.body;

        var dynamicSQL = {

        };

        if (option == "byId") {
            if (!itemID) {
                res.send("Missing item ID");
                return;
            }
            dynamicSQL['where'] = { id: itemID };
        } else if (option == "byStatus_unlisted") {
            dynamicSQL['where'] = { json: "Listed" };
        } else if (option == "byStatus_listed") {
            dynamicSQL['where'] = { status: "Unlisted" };
        } else if (option == "byPrice") {
            dynamicSQL['where'] = { status: "Unlisted" };
        } else {
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

    static checkout = async (req: Request, res: Response) => {
        const {
            data
        } = req.body

        if (!data) {
            res.send("Cart is not defined")
            return
        }

        let totalPrice = 0;
        let itemsId = []
        Object.keys(data).forEach(key => {
            totalPrice += data[key].price
            itemsId.push({ id: key })
        });

        //Get jwtpayload
        const jwt = res.locals.jwtPayload

        var groceryList = await getRepository(Grocery).find({ where: itemsId })
        var user = await getRepository(User).findOneOrFail({account: {id: jwt.uid}})

        var newOrder = new Order()
        newOrder.totalPrice = totalPrice
        newOrder.user = user
        newOrder.hasPaid_user = false
        newOrder.hasPaid_deliverer = false

        var order = await getRepository(Order).save(newOrder)

        var temp = []
        groceryList.forEach(e => {
            let newItems = new ItemList()
            newItems.grocery = e
            newItems.order = order
            newItems.quantity = data[e.id].qty
            newItems.totalPrice = totalPrice
            temp.push(newItems)
        })

        getRepository(ItemList).save(temp).then(rs_item => {
            res.send("Success")
            return;
        }).catch(err => {
            console.log(err)
            res.send("error")
            return
        })
        
    }
};

export default TolongBeliController;
