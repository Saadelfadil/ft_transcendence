import { Match, Room } from './game.entities';
import { GameRepository, MatchRepository } from './game.repository';
export declare class GameService {
    private gameRepository;
    private matchRepository;
    constructor(gameRepository: GameRepository, matchRepository: MatchRepository);
    getAllRooms(): Promise<Room[]>;
    getAllMatchs(): Promise<Match[]>;
    getMatchByUserId(id: string): Promise<Match[]>;
}
