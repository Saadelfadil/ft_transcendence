import { BanService } from "src/chat/ban/ban.service";
import { RoomService } from "./room.service";
import { AppService } from "src/users/app.service";
export declare class ChatRoomGateway {
    private readonly banService;
    private readonly roomService;
    private readonly usersService;
    constructor(banService: BanService, roomService: RoomService, usersService: AppService);
    handleMessage(client: any, payload: any): Promise<{
        status: boolean;
    }>;
    joinRoom(client: any, payload: any): Promise<{
        status: boolean;
    }>;
    leaveRoom(client: any, payload: any): Promise<{
        status: boolean;
    }>;
    joinRoomM(client: any, payload: any): Promise<void>;
}
