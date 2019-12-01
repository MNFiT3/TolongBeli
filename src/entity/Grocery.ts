import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { ItemList } from './ItemList';

@Entity()
export class Grocery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    json: any;

    @OneToMany(type => ItemList, itemList => itemList.grocery)
    itemList: ItemList[];
}