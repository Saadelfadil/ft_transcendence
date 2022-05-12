import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { BlockService } from 'src/chat/block/block.service';
import { BanService } from 'src/chat/ban/ban.service';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
export declare class RoomController {
    private readonly roomService;
    private readonly blockService;
    private readonly userService;
    private banService;
    constructor(roomService: RoomService, blockService: BlockService, userService: AppService, banService: BanService);
    create(createRoomDto: CreateRoomDto, req: Request): Promise<{
        status: boolean;
        roomData: import("./entities/room.entity").Rooms;
    } | {
        status: boolean;
        roomData?: undefined;
    }>;
    findAll(): Promise<import("./entities/room.entity").Rooms[]>;
    findOne(id: string): Promise<import("./entities/room.entity").Rooms>;
    update(id: string, updateRoomDto: UpdateRoomDto, req: Request): Promise<import("./entities/room.entity").Rooms>;
    remove(id: string, req: Request): Promise<import("./entities/room.entity").Rooms>;
    findRoomMessages(roomId: string, req: Request): Promise<any>;
    saveMessageToRoom(roomId: string, createRoomMessageDto: CreateRoomMessageDto, req: Request): Promise<import("./entities/room-message.entity").RoomMessage>;
    addRoomAdmin(roomId: string, data: string, req: Request): Promise<{
        status: boolean;
    }>;
    removeRoomAdmin(roomId: string, data: string, req: Request): Promise<{
        status: boolean;
    }>;
}