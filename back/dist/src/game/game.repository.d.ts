import { Repository } from "typeorm";
import { Match, Room } from "./game.entities";
import { roomDb, roomNode } from "./game.interface";
export declare class MatchRepository extends Repository<Match> {
    addMatchData(data: roomNode, type: string): Promise<void>;
    getAllMatchs(): Promise<Match[]>;
    getMatchByUserId(id: string): Promise<Match[]>;
}
export declare class GameRepository extends Repository<Room> {
    addRoom(roomDb: roomDb): Promise<void>;
    getAllRooms(): Promise<Room[]>;
    deleteRoom(room: string): Promise<void>;
}
