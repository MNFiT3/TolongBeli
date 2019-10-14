import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Grocery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({
        type: 'simple-json'
    })
    json: any;
}