import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { AccountType } from './AccountType';
import { User } from './User';
import { Deliverer } from './Deliverer';

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    scope: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column({
        type: 'simple-json',
        nullable: false
    })
    json: any;

    @OneToOne(type => AccountType, accountType => accountType.account)
    @JoinColumn()
    accountType: AccountType;

    @OneToOne(type => User, user => user.account)
    user: User;

    @OneToOne(type => Deliverer, deliverer => deliverer.account)
    deliverer: Deliverer;
}