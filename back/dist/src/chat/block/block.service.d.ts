import { Repository } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { Block } from './entities/block.entity';
export declare class BlockService {
    private blocksRepository;
    constructor(blocksRepository: Repository<Block>);
    arrayRemove(users: number[], userId: number): number[];
    findUser(userId: number): Promise<Block>;
    blockUser(sessionId: number, createBlockDto: CreateBlockDto): Promise<Block>;
    unBlockUser(sessionId: number, createBlockDto: CreateBlockDto): Promise<Block>;
    blockedList(sessionId: number): Promise<any>;
    blockedListUsers(sessionId: number): Promise<any>;
    isBlocked(sessionId: number, userId: number): Promise<{
        blocked: boolean;
    }>;
}
