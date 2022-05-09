import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('userGame')
export class UserGameEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;
    
    @Column({ type: 'bigint', nullable: false})
    wins: number = 0;

    @Column({ type: 'bigint', nullable: false})
    loses: number = 0;

    @Column({ type: 'bigint', nullable: false})
    score: number = 0;
}