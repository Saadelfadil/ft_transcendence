import { Rooms } from 'src/chat/room/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Ban } from './entities/ban.entity';
export declare class BanService {
    private bansRepository;
    constructor(bansRepository: Repository<Ban>);
    create(sessionId: number, roomData: Rooms, createBanDto: CreateBanDto): Promise<Ban>;
    findAll(): Promise<Ban[]>;
    roomBannedList(roomId: number): Promise<number[]>;
    findUserInRoom(roomId: number, userId: number): Promise<Ban>;
    update(sessionId: number, roomData: Rooms, updateBanDto: UpdateBanDto): Promise<Ban>;
    unbanUserFromRoom(sessionId: number, roomData: Rooms, roomId: number, userId: number): Promise<Ban>;
}
