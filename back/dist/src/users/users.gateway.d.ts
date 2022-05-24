import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class OnlineGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private onlineUsers;
    private inGameUsers;
    constructor();
    server: Server;
    private logger;
    handleOnlineUsers(client: any, payload: any): any;
    InGameUsers(client: any, payload: any): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
