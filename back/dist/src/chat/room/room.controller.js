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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const create_room_message_dto_1 = require("./dto/create-room-message.dto");
const block_service_1 = require("../block/block.service");
const ban_service_1 = require("../ban/ban.service");
const auth_guard_1 = require("../../users/auth.guard");
const app_service_1 = require("../../users/app.service");
const change_password_dto_1 = require("./dto/change-password.dto");
let RoomController = class RoomController {
    constructor(roomService, blockService, userService, banService) {
        this.roomService = roomService;
        this.blockService = blockService;
        this.userService = userService;
        this.banService = banService;
    }
    async create(createRoomDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.roomService.create(sessionId, createRoomDto);
    }
    findAll() {
        return this.roomService.findAll();
    }
    async IsRoomPassValid(body, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        let status = true;
        if (body.room_pass !== '')
            status = await this.roomService.checkAuth(body.room_id, body.room_pass);
        if (status) {
            this.userService.addRoomIdToJoinedRooms(user.id, body.room_id);
        }
        return { status: status };
    }
    async LeaveRoom(body, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        await this.userService.removeRoomIdFromJoinedRooms(user.id, body.room_id);
        return { status: true };
    }
    findOne(id) {
        return this.roomService.findOne(+id);
    }
    async update(id, changePasswordDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.roomService.update(sessionId, +id, changePasswordDto);
    }
    async remove(id, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        await this.roomService.remove(sessionId, +id);
        this.userService.removeFromJoinedRooms(+id);
    }
    async findRoomMessages(roomId, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.roomService.findRoomMessages(sessionId, [], +roomId);
    }
    async saveMessageToRoom(roomId, createRoomMessageDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        const roomBannedList = await this.banService.roomBannedList(+roomId);
        if (roomBannedList.includes(sessionId))
            throw new common_1.HttpException({ message: 'You can\'t participate in this room' }, common_1.HttpStatus.UNAUTHORIZED);
        return this.roomService.saveMessageToRoom(sessionId, createRoomMessageDto);
    }
    async addRoomAdmin(roomId, data, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        const roomData = await this.roomService.findOne(+roomId);
        if (sessionId == roomData.owner_id || roomData.admins.includes(sessionId)) {
            return this.roomService.addRoomAdmin(+roomId, +data['user_id']);
        }
        else
            throw new common_1.HttpException({ message: 'Unauthorized operation' }, common_1.HttpStatus.UNAUTHORIZED);
    }
    async removeRoomAdmin(roomId, data, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        const roomData = await this.roomService.findOne(+roomId);
        if (sessionId == roomData.owner_id || roomData.admins.includes(sessionId)) {
            const saved = await this.roomService.removeRoomAdmin(+roomId, +data['user_id']);
            if (saved)
                return { status: true };
            else
                return { status: false };
        }
        else
            throw new common_1.HttpException({ message: 'Unauthorized operation' }, common_1.HttpStatus.UNAUTHORIZED);
    }
};
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Post)('checkroompass'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "IsRoomPassValid", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Post)('leaveroom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "LeaveRoom", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "update", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':roomId/messages'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "findRoomMessages", null);
__decorate([
    (0, common_1.Post)(':roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_room_message_dto_1.CreateRoomMessageDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "saveMessageToRoom", null);
__decorate([
    (0, common_1.Post)(':roomId/add-admin'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "addRoomAdmin", null);
__decorate([
    (0, common_1.Post)(':roomId/remove-admin'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "removeRoomAdmin", null);
RoomController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Controller)('room'),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => ban_service_1.BanService))),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        block_service_1.BlockService,
        app_service_1.AppService,
        ban_service_1.BanService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map