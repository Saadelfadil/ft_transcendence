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
const websockets_1 = require("@nestjs/websockets");
const ban_service_1 = require("../ban/ban.service");
const create_room_message_dto_1 = require("./dto/create-room-message.dto");
const room_service_1 = require("./room.service");
const app_service_1 = require("../../users/app.service");
let ChatRoomGateway = class ChatRoomGateway {
    constructor(banService, roomService, usersService) {
        this.banService = banService;
        this.roomService = roomService;
        this.usersService = usersService;
    }
    async handleMessage(client, payload) {
        const sessionId = +payload.data.from;
        const roomBannedList = await this.banService.roomBannedList(+payload.data.roomName);
        if (roomBannedList.includes(sessionId)) {
            return { status: false };
        }
        else {
            let messageDto = new create_room_message_dto_1.CreateRoomMessageDto();
            messageDto.room_id = +payload.data.roomName;
            messageDto.msg = payload.data.message;
            this.roomService.saveMessageToRoom(sessionId, messageDto);
            client.broadcast.to(payload.data.roomName).emit("message", payload);
            return { status: true };
        }
    }
    async joinRoom(client, payload) {
        const authStatus = await this.roomService.checkAuth(+payload.data.roomName, payload.data.password);
        if (authStatus) {
            const sessionId = +payload.data.from;
            this.usersService.joinRoom(+sessionId, +payload.data.roomName);
            client.join(payload.data.roomName);
            return { status: true };
        }
        else {
            return { status: false };
        }
    }
    async leaveRoom(client, payload) {
        const sessionId = +payload.data.from;
        const leaveingStatus = this.usersService.leaveRoom(sessionId, +payload.data.roomName);
        if (leaveingStatus) {
            client.leave(payload.data.roomName);
            return { status: true };
        }
        else {
            return { status: false };
        }
    }
    async joinRoomM(client, payload) {
        client.join(payload.data.roomName);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('chat-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "leaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room-m'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRoomGateway.prototype, "joinRoomM", null);
ChatRoomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8000, { cors: true }),
    __metadata("design:paramtypes", [ban_service_1.BanService,
        room_service_1.RoomService,
        app_service_1.AppService])
], ChatRoomGateway);
exports.ChatRoomGateway = ChatRoomGateway;
//# sourceMappingURL=chat-room.gateway.js.map