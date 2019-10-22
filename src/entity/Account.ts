import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Deliverer } from './Deliverer';

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    scope: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    json: any;

    @OneToOne(type => User, user => user.account)
    user: User;

    @OneToOne(type => Deliverer, deliverer => deliverer.account)
    deliverer: Deliverer;
}