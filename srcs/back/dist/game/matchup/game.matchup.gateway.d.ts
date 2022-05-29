import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { GameRepository, MatchRepository } from '../game.repository';
import { MatchUpLogic } from './game.matchup.logic';
export declare class MatchUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private gameRepository;
    private matchRepository;
    private userRepository;
    private matchUpLogic;
    constructor(gameRepository: GameRepository, matchRepository: MatchRepository, userRepository: Repository<UserEntity>, matchUpLogic: MatchUpLogic);
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    checkRoomconnection(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
    initGame(client: any): void;
    updatePos(client: any, curspos: number): void;
    setRoom(client: any, room: string): void;
    clientType(client: any, data: any): void;
    clear(client: any): void;
    startGame(client: any): void;
}
