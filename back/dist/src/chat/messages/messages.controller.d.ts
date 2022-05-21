import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { BlockService } from 'src/chat/block/block.service';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
export declare class MessagesController {
    private readonly messagesService;
    private readonly blockService;
    private readonly userService;
    constructor(messagesService: MessagesService, blockService: BlockService, userService: AppService);
    finfffdOne(id: string, req: Request): Promise<import("./entities/message.entity").Message>;
    create(createMessageDto: CreateMessageDto, req: Request): Promise<import("./entities/message.entity").Message>;
    findAll(req: Request): Promise<any>;
    findOne(id: string, req: Request): Promise<any>;
    remove(id: string, req: Request): Promise<false | import("typeorm").DeleteResult>;
}
