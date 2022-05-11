import { Repository } from 'typeorm';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomMessage } from './entities/room-message.entity';
import { Rooms } from './entities/room.entity';
export declare class RoomService {
    private roomsRepository;
    private roomsMessagesRepository;
    constructor(roomsRepository: Repository<Rooms>, roomsMessagesRepository: Repository<RoomMessage>);
    arrayRemove(roomAdmins: number[], userId: number): number[];
    create(sessionId: number, createRoomDto: CreateRoomDto): Promise<{
        status: boolean;
        roomData: Rooms;
    } | {
        status: boolean;
        roomData?: undefined;
    }>;
    findRoomMessages(sessionId: number, excludeUsersList: number[], roomId: number): Promise<any>;
    saveMessageToRoom(sessionId: number, createRoomMessageDto: CreateRoomMessageDto): Promise<RoomMessage>;
    findAll(): Promise<Rooms[]>;
    findOne(id: number): Promise<Rooms>;
    update(sessionId: number, id: number, updateRoomDto: UpdateRoomDto): Promise<Rooms>;
    remove(sessionId: number, id: number): Promise<Rooms>;
    checkAuth(roomId: number, password: string): Promise<boolean>;
    addRoomAdmin(roomId: number, userId: number): Promise<{
        status: boolean;
    }>;
    removeRoomAdmin(roomId: number, userId: number): Promise<{
        status: boolean;
    }>;
}
