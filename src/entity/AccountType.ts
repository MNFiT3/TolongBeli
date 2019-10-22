import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Account } from './Account';

@Entity()
export class AccountType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToOne(type => Account, account => account.accountType)
    account: Account;
}