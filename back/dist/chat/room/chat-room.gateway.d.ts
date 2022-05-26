import { BanService } from "src/chat/ban/ban.service";
import { RoomService } from "./room.service";
import { AppService } from "src/users/app.service";
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly banService;
    private readonly roomService;
    private readonly usersService;
    constructor(banService: BanService, roomService: RoomService, usersService: AppService);
    server: Server;
    private logger;
    handleMessage(client: Socket, payload: any): Promise<{
        status: boolean;
    }>;
    AdminsChanged(client: Socket, payload: any): Promise<void>;
    leaveRoom(client: any, payload: any): Promise<{
        status: boolean;
    }>;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
