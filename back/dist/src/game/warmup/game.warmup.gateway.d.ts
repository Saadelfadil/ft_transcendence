import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { GameRepository, MatchRepository } from '../game.repository';
import { WarmUpLogic } from './game.warmup.logic';
export declare class WarmUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private gameRepository;
    private matchRepository;
    private userRepository;
    private warmUp;
    constructor(gameRepository: GameRepository, matchRepository: MatchRepository, userRepository: Repository<UserEntity>, warmUp: WarmUpLogic);
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
    clientType(client: any, data: any): void;
    initGame(client: any, clientData: any): void;
    startTime(client: any): void;
    startGame(client: any): void;
    stopGame(client: any): void;
    stopTime(client: any): void;
    updatePos(client: any, curspos: number): void;
}
