"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomGateway = void 0;
const ban_service_1 = require("../ban/ban.service");
const create_room_message_dto_1 = require("./dto/create-room-message.dto");
const room_service_1 = require("./room.service");
const app_service_1 = require("../../users/app.service");
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let ChatRoomGateway = class ChatRoomGateway {
    constructor(banService, roomService, usersService) {
        this.banService = banService;
        this.roomService = roomService;
        this.usersService = usersService;
        this.logger = new common_1.Logger('MessageGateway');
    }
    async handleMessage(client, payload) {
        const sessionId = +payload.data.from_id;
        const roomBannedList = await this.banService.roomBannedList(+payload.data.roomName);
        if (roomBannedList.includes(sessionId)) {
            return { status: false };
        }
        else {
            let messageDto = new create_room_message_dto_1.CreateRoomMessageDto();
            messageDto.room_id = +payload.data.roomName;
            messageDto.msg = payload.data.message;
            this.roomService.saveMessageToRoom(sessionId, messageDto).then((saved_msg) => {
                payload.data.id = saved_msg.id;
                this.server.emit(payload.data.roomName, payload);
            });
            return { status: true };
        }
    }
    async AdminsChanged(client, payload) {
        console.log(`backend reahced with ${JSON.stringify(payload)}`);
        this.server.emit(payload.room_name, { data: { admin_id: payload.admin_id, add: payload.add } });
    }
    async leaveRoom(client, payload) {
        const sessionId = +payload.data.from_id;
        const leaveingStatus = this.usersService.leaveRoom(sessionId, +payload.data.roomName);
        if (leaveingStatus) {
            return { status: true };
        }
        else {
            return { status: false };
        }
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatRoomGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('public-chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('admins-changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "AdminsChanged", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "leaveRoom", null);
ChatRoomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'publicChat',
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [ban_service_1.BanService,
        room_service_1.RoomService,
        app_service_1.AppService])
], ChatRoomGateway);
exports.ChatRoomGateway = ChatRoomGateway;
//# sourceMappingURL=chat-room.gateway.js.map