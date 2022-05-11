import { AppService } from 'src/users/app.service';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { Request } from 'express';
export declare class BlockController {
    private readonly blockService;
    private readonly userService;
    constructor(blockService: BlockService, userService: AppService);
    blockUser(createBlockDto: CreateBlockDto, req: Request): Promise<import("./entities/block.entity").Block>;
    blockedList(req: Request): Promise<any>;
    unBlockUser(createBlockDto: CreateBlockDto, req: Request): Promise<import("./entities/block.entity").Block>;
    isBlocked(id: string, req: Request): Promise<{
        blocked: boolean;
    }>;
}
