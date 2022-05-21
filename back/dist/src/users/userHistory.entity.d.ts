import { BaseEntity } from "typeorm";
export declare class UserHistoryEntity extends BaseEntity {
    id: number;
    opponent: number[];
    user_score: number[];
    opponent_score: number[];
}
