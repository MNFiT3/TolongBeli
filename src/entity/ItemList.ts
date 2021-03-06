import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
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
        nullable: true
    })
    json: any;
    
    @ManyToOne(type => Grocery, grocery => grocery.itemList)
    grocery: Grocery;

    @ManyToOne(type => Order, order => order.itemList)
    order: Order;
}