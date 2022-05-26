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
const block_service_1 = require("../block/block.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const messages_service_1 = require("./messages.service");
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let MessageGateway = class MessageGateway {
    constructor(blockService, messagesService) {
        this.blockService = blockService;
        this.messagesService = messagesService;
        this.logger = new common_1.Logger('MessageGateway');
    }
    async handleMessage(client, payload) {
        const sessionId = +payload.data.from_id;
        const userBlockedList = await this.blockService.blockedList(+payload.data.to_id);
        if (userBlockedList.includes(sessionId)) {
            return { status: false };
        }
        else {
            if (!payload.data.isInvite) {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to_id;
                messageDto.msg = payload.data.message;
                const res = await this.messagesService.create(sessionId, messageDto);
                payload.data.id = res.id;
                payload.data.created = res.created;
            }
            else if (payload.data.inviteStatus == 0) {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to_id;
                messageDto.msg = payload.data.message;
                const res = await this.messagesService.create(sessionId, messageDto);
                payload.data.id = res.id;
                payload.data.created = res.created;
                console.log("mp2 : ", payload);
            }
            else {
                let messageDto = new create_message_dto_1.CreateMessageDto();
                messageDto.inviteStatus = payload.data.inviteStatus;
                messageDto.isInvite = payload.data.isInvite;
                messageDto.to_id = +payload.data.to_id;
                messageDto.msg = payload.data.message;
                messageDto.created = payload.data.created;
                this.messagesService.updateMessage(payload.data.id);
            }
            this.server.emit(payload.data.roomName, payload);
            return { status: true };
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
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('private-chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'privateChat',
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [block_service_1.BlockService,
        messages_service_1.MessagesService])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=messages.gateway.js.map