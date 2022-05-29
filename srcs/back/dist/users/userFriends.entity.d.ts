import { BaseEntity } from "typeorm";
export declare class UserFriendsEntity extends BaseEntity {
    id: number;
    user_friends: number[];
    user_blocked: number[];
    user_requested: number[];
}
