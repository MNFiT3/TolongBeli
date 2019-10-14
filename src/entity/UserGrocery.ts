import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserGrocery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

}