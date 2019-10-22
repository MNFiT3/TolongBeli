import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Grocery } from './Grocery';
import { Order } from './Order';

@Entity()
export class ItemList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @Column({
        type: 'simple-json',
        nullable: false
    })
    json: any;
    
    @ManyToOne(type => Grocery, grocery => grocery.itemList)
    grocery: Grocery;

    @OneToOne(type => Order, order => order.itemList)
    order: Order;
}