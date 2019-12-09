import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Grocery } from "../entity/Grocery";
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { ItemList } from "../entity/ItemList";
import { Account } from "../entity/Account";
import { Deliverer } from "../entity/Deliverer";

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
        var user = await getRepository(User).findOneOrFail({ account: { id: jwt.uid } })

        const dt = new Date()
        const dateTimeUTC = dt.getUTCFullYear + '-' + dt.getUTCMonth + '-' + dt.getUTCDay + ' ' + dt.getUTCHours + ':' + dt.getUTCMinutes + ':' + dt.getUTCSeconds

        var newOrder = new Order()
        newOrder.totalPrice = totalPrice
        newOrder.user = user
        newOrder.hasPaid = false
        newOrder.createdOn = dateTimeUTC

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

    static myOrder = async (req: Request, res: Response) => {
        const {
            accountId,
            option,
            value
        } = req.body

        //Get jwtpayload
        const jwt = res.locals.jwtPayload

        var account = await getRepository(Account).findOneOrFail({
            relations: ['user'],
            where: {
                id: accountId || jwt.uid
            }
        })
        var data

        if (option == 'all') {
            data = await getRepository(Order).find({
                where: {
                    user: {
                        id: account.user.id
                    },
                }
            })
        } else if (option == 'byId') {

            if (!value) {
                res.send('Missing value')
                return
            }

            data = await getRepository(Order).findOneOrFail({
                relations: ['itemList', 'itemList.grocery'],
                where: {
                    user: {
                        id: account.user.id
                    },
                    id: value
                }
            })
        } else {
            res.send('Invalid argrument')
            return
        }

        res.json(data)
    }

    static delivererOpenJob = async (req: Request, res: Response) => {
        const availJobs = await getRepository(Order).findAndCount({ where: { hasPaid: false, deliverer: null }, relations: ['user'] })

        availJobs[0].forEach(e => {
            delete e['user']['json']
        })

        res.json(availJobs)
    }

    static delivererAcceptJob = async (req: Request, res: Response) => {
        const { orderId
        } = req.body
        const jwt = res.locals.jwtPayload

        if (!orderId) {
            res.send("OrderId attribute missing")
            return
        }

        var applyJob: Order
        try {
            applyJob = await getRepository(Order).findOneOrFail({ where: { id: orderId } })
        } catch (error) {
            res.send('Error occured applying the job')
            return
        }

        var deliverer: Deliverer
        try {
            deliverer = await getRepository(Deliverer).findOneOrFail({ where: { account: jwt.uid } })
        } catch (error) {
            res.send('Error getting deliver data')
            return
        }

        applyJob.deliverer = deliverer

        try {
            await getRepository(Order).save(applyJob)
        } catch (error) {
            res.send('Error applying job')
            return
        }

        res.send('SUCCESS')
    }

    static userPay = async (req: Request, res: Response) => {
        const { orderId } = req.body
        const jwt = res.locals.jwtPayload

        if (!orderId) {
            res.send("OrderId attribute missing")
            return
        }

        var order: Order
        try {
            order = await getRepository(Order).findOneOrFail({ where: { id: orderId}})
        } catch (error) {
            res.send('Error finding order')
            return
        }

        if(order.hasPaid){
            res.send('Order already paid')
            return
        }

        order.hasPaid = true

        if(order.json == null){
            order.json = {}
        }

        order.json['paidAt'] = new Date()
        order.json['paidBy'] = jwt.uid

        try {
            await getRepository(Order).save(order)
        } catch (error) {
            res.send('Error updating the order')
            return
        }

        res.send('SUCCESS')
    }
};

export default TolongBeliController;
