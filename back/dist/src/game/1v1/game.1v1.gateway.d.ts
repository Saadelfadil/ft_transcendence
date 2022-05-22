import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { GameRepository, MatchRepository } from '../game.repository';
import { oneVoneLogic } from './game.1v1.logic';
export declare class oneVoneGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private gameRepository;
    private matchRepository;
    private userRepository;
    private oneVoneLogic;
    constructor(gameRepository: GameRepository, matchRepository: MatchRepository, userRepository: Repository<UserEntity>, oneVoneLogic: oneVoneLogic);
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    clear(client: Socket): void;
    initData(client: Socket): void;
    setRoom(client: Socket, data: any): void;
    clientType(client: any, data: any): void;
    startGame(client: any): void;
    updatePos(client: any, curspos: number): void;
    decline(client: Socket, room: string): void;
}
