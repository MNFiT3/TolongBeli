import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccountType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
}