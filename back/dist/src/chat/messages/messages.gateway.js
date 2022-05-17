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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const block_service_1 = require("../block/block.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const messages_service_1 = require("./messages.service");
let MessageGateway = class MessageGateway {
    constructor(blockService, messagesService) {
        this.blockService = blockService;
        this.messagesService = messagesService;
    }
    async handleMessage(client, payload) {
        const sessionId = +payload.data.from;
        const userBlockedList = await this.blockService.blockedList(+payload.data.to);
        if (userBlockedList.includes(sessionId)) {
            return { status: false };
        }
        else {
            if (!payload.data.isInvite) {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to;
                messageDto.msg = payload.data.message;
                this.messagesService.create(sessionId, messageDto);
            }
            else if (payload.data.inviteStatus == 0) {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to;
                messageDto.msg = payload.data.message;
                this.messagesService.create(sessionId, messageDto);
            }
            else {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.inviteStatus = payload.data.inviteStatus;
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to;
                messageDto.msg = payload.data.message;
                messageDto.created = payload.data.created;
                this.messagesService.updateMessage(messageDto);
            }
            client.broadcast.to(payload.data.roomName).emit("message", payload);
            return { status: true };
        }
    }
    async joinRoom(client, payload) {
        client.join(payload.data.roomName);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('private-chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "joinRoom", null);
MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8001, { cors: true }),
    __metadata("design:paramtypes", [block_service_1.BlockService,
        messages_service_1.MessagesService])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=messages.gateway.js.map