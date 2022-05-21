import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Room } from './game.entities';
import { GameRepository, MatchRepository } from './game.repository';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(GameRepository)
        private gameRepository: GameRepository,
        private matchRepository: MatchRepository,
    ){}

    async getAllRooms(): Promise<Room[]>{
        return this.gameRepository.getAllRooms();
    }

    async getAllMatchs(): Promise<Match[]>{
        return this.matchRepository.getAllMatchs();
    }

    async getMatchByUserId(id: string): Promise<Match[]>{
        console.log(id);
        return this.matchRepository.getMatchByUserId(id);
    }
}
