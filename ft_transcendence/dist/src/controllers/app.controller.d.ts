import { JwtService } from '@nestjs/jwt';
import { AppService } from '../services/app.service';
import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserFriendsEntity } from '../entities/userFriends.entity';
import { UserGameEntity } from '../entities/userGame.entity';
import { UserHistoryEntity } from '../entities/userHistory.entity';
export declare class AppController {
    private readonly appService;
    private readonly jwtService;
    private readonly userRepository;
    private readonly userFriendsEntity;
    private readonly userGameEntity;
    private readonly userHistoryEntity;
    constructor(appService: AppService, jwtService: JwtService, userRepository: Repository<UserEntity>, userFriendsEntity: Repository<UserFriendsEntity>, userGameEntity: Repository<UserGameEntity>, userHistoryEntity: Repository<UserHistoryEntity>);
    getRequests(body: any): Promise<any[]>;
    getFriends(body: any): Promise<any[]>;
    addFriend(body: any): Promise<boolean>;
    removeFriend(body: any): Promise<void>;
    RequestToFriend(body: any): Promise<void>;
    profile(request: Request): Promise<UserEntity>;
    loginOrNot(request: Request, query: any): Promise<{
        is_login_db: boolean;
        id: number;
    }>;
    updateU(request: Request, body: any): Promise<any>;
    verify(request: Request, body: any): Promise<void>;
    validate(request: Request): Promise<{
        success: boolean;
        twof_qrcode: any;
        twof_secret: any;
        sucess?: undefined;
    } | {
        success: boolean;
        twof_qrcode?: undefined;
        twof_secret?: undefined;
        sucess?: undefined;
    } | {
        sucess: boolean;
        success?: undefined;
        twof_qrcode?: undefined;
        twof_secret?: undefined;
    }>;
    getData(code: string, response: Response): Promise<string>;
    user(request: Request): Promise<any>;
    allUser(body: any): Promise<{
        id: number;
        login: string;
        image_url: string;
    }[]>;
    logout(response: Response): Promise<string>;
}
