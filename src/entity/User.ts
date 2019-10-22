import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Account } from './Account';
import { Order } from './Order';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-json'
    })
    address: any;

    @Column({
        type: 'simple-json',
        nullable: false
    })
    json: any;

    @OneToOne(type => Account, account => account.user)
    @JoinColumn()
    account: Account;

    @OneToOne(type => Order, order => order.user)
    order: Order;
}