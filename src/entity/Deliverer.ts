import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deliverer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-json'
    })
    vehicle: any;

    @Column()
    isApproved: boolean;
}