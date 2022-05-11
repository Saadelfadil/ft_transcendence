import { BlockService } from "src/chat/block/block.service";
import { MessagesService } from "./messages.service";
export declare class MessageGateway {
    private readonly blockService;
    private readonly messagesService;
    constructor(blockService: BlockService, messagesService: MessagesService);
    handleMessage(client: any, payload: any): Promise<{
        status: boolean;
    }>;
    joinRoom(client: any, payload: any): Promise<void>;
}
