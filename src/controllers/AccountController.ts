import { Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { Account } from "../entity/Account";
import { User } from "../entity/User";
import { Deliverer } from "../entity/Deliverer";

const SALT_ROUNDS = 10;

class AccountController {

    static register = async (req: Request, res: Response) => {
        const {
            email,
            password,
            username,
            phone,
            address,
            plateNumber,
            ic,
            scope
        } = req.body;

        if (scope != 'user' && scope != 'deliverer') {
            res.send("Register out of scope")
            return;
        }
        //Check the basic requirement
        if (!(email && password && username && phone)) {
            res.send("Missing improtant attributes")
            return;
        }
        //Check requirement for user 
        if (scope == "user" && !address) {
            res.send("Missing user attributes")
            return;
        } else if (scope == "deliverer" && !plateNumber && !ic) {
            res.send("Missing deliverer attributes")
            return;
        }

        var account = new Account();
        account.scope = scope;
        account.email = email;
        account.username = username;

        bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
            if (err) {
                res.send("Server error");
                return;
            }

            account.password = hash;


            getRepository(Account).save(account).then(rs => {
                if (scope == 'user') {
                    var user = new User();
                    user.account = rs;
                    user.address = address;

                    getRepository(User).save(user);

                    res.send("Successfully registered.");
                    return;

                } else if (scope == 'deliverer') {
                    var deliverer = new Deliverer();
                    deliverer.account = account;
                    deliverer.isApproved = false;
                    deliverer.vehicle = {
                        plateNumber: plateNumber
                    };
                    deliverer.json = {
                        documents: {
                            ic: ic
                        }
                    }
                    getRepository(Deliverer).save(deliverer);

                    res.send("Successfully registered. Wait for approval");
                    return;
                }
            }).catch(err => {
                if(err.message.includes("UNIQUE constraint failed")){
                    res.send("Email is already being used");
                    return;
                }
            })
        });



    }
}
export default AccountController;
