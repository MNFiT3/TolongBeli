import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
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
    hasPaid: boolean;

    @Column({
        type: "datetime"
    })
    @CreateDateColumn()
    createdOn: string;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    json: any;

    @ManyToOne(type => User, user => user.order)
    user: User;

    @OneToOne(type => Deliverer, deliverer => deliverer.order)
    @JoinColumn()
    deliverer: Deliverer;

    @OneToMany(type => ItemList, itemList => itemList.order)
    itemList: ItemList[];
}