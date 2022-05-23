import { RoomService } from 'src/chat/room/room.service';
import { BanService } from './ban.service';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
export declare class BanController {
    private readonly banService;
    private readonly userService;
    private roomService;
    constructor(banService: BanService, userService: AppService, roomService: RoomService);
    create(createBanDto: CreateBanDto, req: Request): unknown;
    findAll(): any;
    update(updateBanDto: UpdateBanDto, req: Request): unknown;
    roomBannedList(roomId: string): unknown;
    findUserInRoom(roomId: string, userId: string): unknown;
    unbanUserFromRoom(roomId: string, userId: string, req: Request): unknown;
}
