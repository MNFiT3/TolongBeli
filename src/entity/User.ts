import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
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
        nullable: true
    })
    json: any;

    @OneToOne(type => Account, account => account.user)
    @JoinColumn()
    account: Account;

    @OneToMany(type => Order, order => order.user)
    order: Order[];
}