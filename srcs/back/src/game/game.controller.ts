import { Controller, Get, Param } from '@nestjs/common';
import { Match, Room } from './game.entities';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
    ){}

    @Get('rooms')
    getAllRooms(): Promise<Room[]>{
        return this.gameService.getAllRooms();
    }

    @Get('matchs')
    getAllMatchs(): Promise<Match[]>{
        return this.gameService.getAllMatchs();
    }

    @Get('matchs/:id')
    getMatchByUserId(@Param('id') id: string): Promise<Match[]>{
        return this.gameService.getMatchByUserId(id);
    }

}
