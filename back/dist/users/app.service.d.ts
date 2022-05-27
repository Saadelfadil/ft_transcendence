import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Request } from 'express';
import { UserFriendsEntity } from './userFriends.entity';
import { UserHistoryEntity } from './userHistory.entity';
export declare class AppService {
    private readonly userRepository;
    private readonly userFriendsEntity;
    private readonly userHistoryEntity;
    private readonly jwtService;
    constructor(userRepository: Repository<UserEntity>, userFriendsEntity: Repository<UserFriendsEntity>, userHistoryEntity: Repository<UserHistoryEntity>, jwtService: JwtService);
    googleLogin(req: any): {
        user: any;
    };
    create(data: any): Promise<UserEntity>;
    getUserByLogin(login: string): Promise<UserEntity>;
    getUserById(id: number): Promise<UserEntity>;
    getUserByIdFriend(id: number): Promise<UserFriendsEntity>;
    getUserByIdHistory(id: number): Promise<UserHistoryEntity>;
    getUserDataFromJwt(request: Request): Promise<UserEntity>;
    generateQR(text: string): Promise<any>;
    uploadImage(twof_qrcode: string): Promise<any>;
    updateUser(request: Request, body: any): Promise<any>;
    addRoomIdToJoinedRooms(user_id: number, room_id: number): Promise<void>;
    removeRoomIdFromJoinedRooms(user_id: number, room_id: number): Promise<void>;
    removeFromJoinedRooms(room_id: number): Promise<void>;
    arrayRemove(joinedRooms: number[], roomId: number): number[];
    findOne(id: number): Promise<UserEntity>;
    joinRoom(id: number, roomId: number): Promise<boolean>;
    leaveRoom(id: number, roomId: number): Promise<boolean>;
}
