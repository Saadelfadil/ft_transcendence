import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('userFriend')
export class UserFriendsEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;
    

    @Column("int", { array: true , default: []})
    user_friends: number[];

    @Column("int", { array: true , default: []})
    user_blocked: number[];

    @Column("int", { array: true , default: []})
    user_requested: number[];
}