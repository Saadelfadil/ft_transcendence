import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Request } from 'express';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';
export declare class AppService {
    private readonly userRepository;
    private readonly userFriendsEntity;
    private readonly userGameEntity;
    private readonly userHistoryEntity;
    private readonly jwtService;
    constructor(userRepository: Repository<UserEntity>, userFriendsEntity: Repository<UserFriendsEntity>, userGameEntity: Repository<UserGameEntity>, userHistoryEntity: Repository<UserHistoryEntity>, jwtService: JwtService);
    googleLogin(req: any): {
        user: any;
    };
    create(data: any): Promise<UserEntity>;
    getUserByLogin(login: string): Promise<UserEntity>;
    getUserById(id: number): Promise<UserEntity>;
    getUserByIdFriend(id: number): Promise<UserFriendsEntity>;
    getUserByIdGame(id: number): Promise<UserGameEntity>;
    getUserByIdHistory(id: number): Promise<UserHistoryEntity>;
    getUserDataFromJwt(request: Request): Promise<UserEntity>;
    generateQR(text: string): Promise<any>;
    uploadImage(twof_qrcode: string): Promise<any>;
    updateUser(request: Request, body: any): Promise<any>;
}
