import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';
export declare class AppController {
    private readonly appService;
    private readonly jwtService;
    private readonly userRepository;
    private readonly userFriendsEntity;
    private readonly userGameEntity;
    private readonly userHistoryEntity;
    constructor(appService: AppService, jwtService: JwtService, userRepository: Repository<UserEntity>, userFriendsEntity: Repository<UserFriendsEntity>, userGameEntity: Repository<UserGameEntity>, userHistoryEntity: Repository<UserHistoryEntity>);
    googleAuth(req: any): Promise<void>;
    getRequests(body: any): Promise<any[]>;
    getFriends(body: any): Promise<any[]>;
    addFriend(body: any): Promise<boolean>;
    removeFriend(body: any): Promise<void>;
    RequestToFriend(body: any): Promise<void>;
    googleAuthRedirect(req: any): {
        user: any;
    };
    profile(request: Request): Promise<UserEntity>;
    game(): string;
    loginOrNot(request: Request, query: any): Promise<{
        is_login_db: boolean;
        id: number;
        image_url: string;
        login: string;
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
    getgamestate(body: any): Promise<{
        in_game: boolean;
    }>;
    getData(code: string, response: Response): Promise<string>;
    user(request: Request): Promise<any>;
    allUser(body: any): Promise<{
        left_player: {
            id: number;
            login: string;
            image_url: string;
        };
        right_player: {
            id: number;
            login: string;
            image_url: string;
        };
    }[]>;
    retUsersList(body: any): Promise<{
        users: {
            login: string;
            id: number;
        }[];
    }>;
    users(): Promise<UserEntity[]>;
    getExactUser(body: any): Promise<{
        login: string;
        image_url: string;
        is_friend: boolean;
        wins: number;
        loses: number;
    }>;
    getloginbyid(body: any): Promise<{
        login: string;
        image_url: string;
    }>;
    getUserJoindAndBlocked(body: any): Promise<{
        joinedRooms: number[];
    }>;
    logout(response: Response): Promise<string>;
}
