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
    getRequests(body: any, request: Request): Promise<any[]>;
    getFriends(body: any, request: Request): Promise<any[]>;
    addFriend(body: any, request: Request): Promise<boolean>;
    removeFriend(body: any, request: Request): Promise<void>;
    RequestToFriend(body: any, request: Request): Promise<void>;
    loginOrNot(request: Request): Promise<{
        is_login_db: boolean;
        id: number;
        image_url: string;
        login: string;
        status: boolean;
    } | {
        status: boolean;
        is_login_db?: undefined;
        id?: undefined;
        image_url?: undefined;
        login?: undefined;
    }>;
    updateU(request: Request, body: any): Promise<any>;
    amIJoinedToThisRoom(request: Request, body: any): Promise<{
        status: boolean;
    }>;
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
    getgamestate(body: any, request: Request): Promise<{
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
    getExactUser(body: any, request: Request): Promise<{
        login: string;
        image_url: string;
        is_friend: boolean;
        wins: number;
        loses: number;
        error?: undefined;
    } | {
        error: boolean;
        login?: undefined;
        image_url?: undefined;
        is_friend?: undefined;
        wins?: undefined;
        loses?: undefined;
    }>;
    getloginbyid(body: any): Promise<{
        login: string;
        image_url: string;
    }>;
    getUserJoindAndBlocked(body: any): Promise<{
        joinedRooms: number[];
    }>;
    FindUserByLogin(body: any): Promise<{
        status: boolean;
        id: number;
    }>;
    logout(response: Response): Promise<string>;
}
