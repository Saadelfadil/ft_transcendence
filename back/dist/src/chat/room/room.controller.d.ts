import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { BlockService } from 'src/chat/block/block.service';
import { BanService } from 'src/chat/ban/ban.service';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class RoomController {
    private readonly roomService;
    private readonly blockService;
    private readonly userService;
    private banService;
    constructor(roomService: RoomService, blockService: BlockService, userService: AppService, banService: BanService);
    create(createRoomDto: CreateRoomDto, req: Request): Promise<{
        status: boolean;
        error: string;
        roomData?: undefined;
    } | {
        status: boolean;
        roomData: import("./entities/room.entity").Rooms;
        error?: undefined;
    }>;
    findAll(): Promise<import("./entities/room.entity").Rooms[]>;
    IsRoomPassValid(body: any, req: Request): Promise<{
        status: boolean;
    }>;
    LeaveRoom(body: any, req: Request): Promise<{
        status: boolean;
    }>;
    findOne(id: string): Promise<import("./entities/room.entity").Rooms>;
    update(id: string, changePasswordDto: ChangePasswordDto, req: Request): Promise<import("./entities/room.entity").Rooms>;
    remove(id: string, req: Request): Promise<void>;
    findRoomMessages(roomId: string, req: Request): Promise<any>;
    saveMessageToRoom(roomId: string, createRoomMessageDto: CreateRoomMessageDto, req: Request): Promise<import("./entities/room-message.entity").RoomMessage>;
    addRoomAdmin(roomId: string, data: string, req: Request): Promise<{
        status: boolean;
    }>;
    removeRoomAdmin(roomId: string, data: string, req: Request): Promise<{
        status: boolean;
    }>;
}
