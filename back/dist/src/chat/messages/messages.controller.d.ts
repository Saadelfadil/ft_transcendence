import { MessagesService } from './messages.service';
import { BlockService } from 'src/chat/block/block.service';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
export declare class MessagesController {
    private readonly messagesService;
    private readonly blockService;
    private readonly userService;
    constructor(messagesService: MessagesService, blockService: BlockService, userService: AppService);
    findAll(req: Request): Promise<any>;
    findOne(id: string, req: Request): Promise<any>;
}
