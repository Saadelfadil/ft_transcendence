import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class OnlineGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private onlineUsers;
    constructor();
    server: Server;
    private logger;
    handleOnlineUsers(client: any, payload: any): any;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
