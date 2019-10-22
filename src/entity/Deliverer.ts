import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Account } from './Account';
import { Order } from './Order';

@Entity()
export class Deliverer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-json'
    })
    vehicle: any;

    @Column()
    isApproved: boolean;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    json: any;
    
    @OneToOne(type => Account, account => account.deliverer)
    @JoinColumn()
    account: Account;

    @OneToOne(type => Order, order => order.deliverer)
    order: Order;
}