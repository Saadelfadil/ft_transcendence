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
exports.BlockController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../../users/app.service");
const auth_guard_1 = require("../../users/auth.guard");
const block_service_1 = require("./block.service");
const create_block_dto_1 = require("./dto/create-block.dto");
let BlockController = class BlockController {
    constructor(blockService, userService) {
        this.blockService = blockService;
        this.userService = userService;
    }
    async blockUser(createBlockDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.blockService.blockUser(sessionId, createBlockDto);
    }
    async blockedList(req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.blockService.blockedListUsers(sessionId);
    }
    async unBlockUser(createBlockDto, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.blockService.unBlockUser(sessionId, createBlockDto);
    }
    async isBlocked(id, req) {
        const user = await this.userService.getUserDataFromJwt(req);
        const sessionId = user.id;
        return this.blockService.isBlocked(sessionId, +id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_block_dto_1.CreateBlockDto, Object]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "blockedList", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_block_dto_1.CreateBlockDto, Object]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "unBlockUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "isBlocked", null);
BlockController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Controller)('block'),
    __metadata("design:paramtypes", [block_service_1.BlockService,
        app_service_1.AppService])
], BlockController);
exports.BlockController = BlockController;
//# sourceMappingURL=block.controller.js.map