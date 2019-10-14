import { Entity, PrimaryGeneratedColumn, Column, Double } from 'typeorm';

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


}