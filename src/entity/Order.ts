import { Entity, PrimaryGeneratedColumn, Column, Double, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Deliverer } from './Deliverer';
import { ItemList } from './ItemList';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalPrice: number;

    @Column()
    hasPaid_user: boolean;

    @Column()
    hasPaid_deliverer: boolean;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    json: any;

    @OneToOne(type => User, user => user.order)
    @JoinColumn()
    user: User;

    @OneToOne(type => Deliverer, deliverer => deliverer.order)
    @JoinColumn()
    deliverer: Deliverer;

    @OneToOne(type => ItemList, itemList => itemList.order)
    @JoinColumn()
    itemList: ItemList;
}