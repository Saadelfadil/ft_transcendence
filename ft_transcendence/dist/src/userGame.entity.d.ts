import { BaseEntity } from "typeorm";
export declare class UserGameEntity extends BaseEntity {
    id: number;
    wins: number;
    loses: number;
    score: number;
}
