import { Match, Room } from './game.entities';
import { GameService } from './game.service';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    getAllRooms(): Promise<Room[]>;
    getAllMatchs(): Promise<Match[]>;
    getMatchByUserId(id: string): Promise<Match[]>;
}
