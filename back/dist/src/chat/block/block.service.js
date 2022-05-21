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
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const block_entity_1 = require("./entities/block.entity");
let BlockService = class BlockService {
    constructor(blocksRepository) {
        this.blocksRepository = blocksRepository;
    }
    arrayRemove(users, userId) {
        return users.filter(function (ele) {
            return ele != userId;
        });
    }
    findUser(userId) {
        return this.blocksRepository.findOne({
            user_id: userId,
        });
    }
    async blockUser(sessionId, createBlockDto) {
        const userData = await this.findUser(sessionId);
        if (userData) {
            if (!userData.blocked.includes(createBlockDto.blocked))
                userData.blocked.push(createBlockDto.blocked);
            return this.blocksRepository.save(userData);
        }
        else {
            let newUserData = this.blocksRepository.create();
            newUserData.user_id = sessionId;
            newUserData.blocked = [createBlockDto.blocked];
            return this.blocksRepository.save(newUserData);
        }
    }
    async unBlockUser(sessionId, createBlockDto) {
        const userData = await this.findUser(sessionId);
        if (userData)
            userData.blocked = this.arrayRemove(userData.blocked, createBlockDto.blocked);
        return this.blocksRepository.save(userData);
    }
    async blockedList(sessionId) {
        const data = await (0, typeorm_2.getConnection)().query(`
			SELECT public."users".*  FROM
				public."block"
				JOIN
						public."users"
					ON
						public."users".id = ANY(public."block".blocked)
				WHERE public."block".user_id = ${sessionId}
		`);
        return data.map(a => a.id);
    }
    blockedListUsers(sessionId) {
        return (0, typeorm_2.getConnection)().query(`
			SELECT public."users".*  FROM
				public."block"
				JOIN
						public."users"
					ON
						public."users".id = ANY(public."block".blocked)
				WHERE public."block".user_id = ${sessionId}
		`);
    }
    async isBlocked(sessionId, userId) {
        const userData = await this.findUser(sessionId);
        if (userData && userData.blocked.includes(userId))
            return { 'blocked': true };
        else
            return { 'blocked': false };
    }
};
BlockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(block_entity_1.Block)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlockService);
exports.BlockService = BlockService;
//# sourceMappingURL=block.service.js.map