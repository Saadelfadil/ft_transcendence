import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(sessionId: number, createMessageDto: CreateMessageDto): Promise<Message>;
    findOneByCreatedDate(msg_id: number): Promise<Message>;
    updateMessage(id: number): Promise<Message>;
    findOneMessage(id: number): Promise<Message>;
    findOne(sessionId: number, userId: number): Promise<any>;
    getChatList(sessionId: number): Promise<any>;
    removeMessage(sessionId: number, messageId: number): Promise<false | import("typeorm").DeleteResult>;
}
