import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Quiz extends BaseEntity {

    @PrimaryGeneratedColumn({
        comment: 'The quiz unique id',
    })
    id: number;


    @Column({
        type: 'varchar',
    })
    title: string;

    @Column({
        type: 'text',
    })
    desription: string;

    @Column({
        type: 'boolean',
        default: 1,
    })
    isActive: boolean;
}