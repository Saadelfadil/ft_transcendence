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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const block_service_1 = require("../block/block.service");
const auth_guard_1 = require("../../users/auth.guard");
const app_service_1 = require("../../users/app.service");
let MessagesController = class MessagesController {
    constructor(messagesService, blockService, userService) {
        this.messagesService = messagesService;
        this.blockService = blockService;
        this.userService = userService;
    }
    async create(createMessageDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        const userBlockedList = await this.blockService.blockedList(createMessageDto.to_id);
        if (userBlockedList.includes(sessionId))
            throw new common_1.HttpException({ message: 'You can\'t send message to this user!' }, common_1.HttpStatus.UNAUTHORIZED);
        return this.messagesService.create(sessionId, createMessageDto);
    }
    async findAll(req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.messagesService.getChatList(sessionId);
    }
    async findOne(id, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.messagesService.findOne(sessionId, +id);
    }
    async remove(id, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.messagesService.remove(sessionId, +id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "remove", null);
MessagesController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        block_service_1.BlockService,
        app_service_1.AppService])
], MessagesController);
exports.MessagesController = MessagesController;
//# sourceMappingURL=messages.controller.js.map