import { BaseEntity } from "typeorm";
export interface matchPlayerData {
    id: string;
    score: number;
}
export declare class Room extends BaseEntity {
    id: number;
    name: string;
    players: string[];
    namespace: string;
}
export declare class Match extends BaseEntity {
    id: number;
    date: Date;
    data: matchPlayerData[];
    playerLeft: string;
    playerRight: string;
    type: string;
}
