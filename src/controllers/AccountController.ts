import { Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { Account } from "../entity/Account";
import { User } from "../entity/User";
import { Deliverer } from "../entity/Deliverer";
import config from "../config/config";

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

        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
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
                    user.json = {
                        status: {
                            message: "Active User",
                            code: 100
                        }
                    }

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
                        status: {
                            message: "Pending confirmation",
                            code: 101
                        },
                        documents: {
                            ic: ic
                        }
                    }
                    getRepository(Deliverer).save(deliverer);

                    res.send("Successfully registered. Please wait for approval from administrator");
                    return;
                }
            }).catch(err => {
                if (err.message.includes("UNIQUE constraint failed")) {
                    res.send("Email is already being used");
                    return;
                }
            })
        });
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.json({
                message: "Missing attributes"
            })
            return;
        }

        getRepository(Account).findOneOrFail({ email: email }, { relations: ['deliverer'] }).then(rs => {
            var uid = rs.id
            var email = rs.email

            const newToken = jwt.sign({ uid, email }, config.jwtSecret, {
                expiresIn: "1h"
            });
            res.setHeader("token", newToken);

            bcrypt.compare(password, rs.password, (err, result) => {
                if (err) {
                    res.json({
                        message: err
                    });
                    return;
                }

                if (!result) {
                    res.json({
                        message: "Wrong password"
                    });
                    return;
                }

                const newToken = jwt.sign({ uid, email }, config.jwtSecret, {
                    expiresIn: "1h"
                });
                res.setHeader("token", newToken);

                res.json({
                    message: "Login success",
                    userData: {
                        email: rs.email,
                        username: rs.username,
                        scope: rs.scope,
                        isApproved: (rs.scope == 'deliverer') ? rs.deliverer.isApproved : null
                    }
                })
            })
        }).catch(err => {
            res.json({
                message: "User with the email is not exists"
            });
            return;
        })
    }
}
export default AccountController;
