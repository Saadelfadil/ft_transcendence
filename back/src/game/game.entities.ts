import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface matchPlayerData{
    id: string,
    score: number
}

@Entity()
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("simple-array")
    players: string[]

    @Column()
    namespace: string
}

@Entity()
export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('timestamptz')
    date: Date

    @Column({type: 'jsonb'})
    data: matchPlayerData[]

    @Column()
    playerLeft: string

    @Column()
    playerRight: string

    @Column()
    type: string
}