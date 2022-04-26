import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('userHistory')
export class UserHistoryEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;
    
    @Column({ type: 'bigint', nullable: false})
    opponent: number[];

    @Column({ type: 'bigint', nullable: false})
    user_score: number[];

    @Column({ type: 'bigint', nullable: false})
    opponent_score: number[];
}