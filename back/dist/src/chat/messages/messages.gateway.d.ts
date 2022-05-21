import { BlockService } from "src/chat/block/block.service";
import { MessagesService } from "./messages.service";
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly blockService;
    private readonly messagesService;
    constructor(blockService: BlockService, messagesService: MessagesService);
    server: Server;
    private logger;
    handleMessage(client: Socket, payload: any): Promise<{
        status: boolean;
    }>;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
