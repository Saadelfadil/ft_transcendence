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
exports.BanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ban_entity_1 = require("./entities/ban.entity");
let BanService = class BanService {
    constructor(bansRepository) {
        this.bansRepository = bansRepository;
    }
    async create(sessionId, roomData, createBanDto) {
        if (!roomData.admins.includes(sessionId))
            throw new common_1.HttpException({ message: 'You\'re not an admin of this room!' }, common_1.HttpStatus.UNAUTHORIZED);
        if (createBanDto.user_id == roomData.owner_id)
            throw new common_1.HttpException({ message: 'You can\'t ban the room crater!' }, common_1.HttpStatus.UNAUTHORIZED);
        const bannedUser = await this.findUserInRoom(createBanDto.room_id, createBanDto.user_id);
        if (bannedUser) {
            bannedUser.created = Date.now();
            bannedUser.banned = createBanDto.banned;
            bannedUser.duration = createBanDto.duration;
            return this.bansRepository.save(bannedUser);
        }
        {
            const newBannedUser = this.bansRepository.create(createBanDto);
            const data = await this.bansRepository.save(newBannedUser);
            return data;
        }
    }
    findAll() {
        return this.bansRepository.find();
    }
    async roomBannedList(roomId) {
        let bannedUsersIds = [];
        const bannedUsers = await (0, typeorm_2.getConnection)().query(`
			SELECT *  FROM
				public."ban"
				WHERE public."ban".room_id = ${roomId};
		`);
        for (let i = 0; i < bannedUsers.length; i++) {
            if (bannedUsers[i].banned == true)
                bannedUsersIds.push(bannedUsers[i].user_id);
            else if ((parseInt(bannedUsers[i].created) + (parseInt(bannedUsers[i].duration) * 1000)) > Date.now()) {
                bannedUsersIds.push(bannedUsers[i].user_id);
            }
        }
        return bannedUsersIds;
    }
    async findUserInRoom(roomId, userId) {
        const data = await this.bansRepository.findOne({
            room_id: roomId,
            user_id: userId,
        });
        return data;
    }
    async update(sessionId, roomData, updateBanDto) {
        if (roomData.admins.includes(sessionId))
            throw new common_1.HttpException({ message: 'You\'re not an admin of this room!' }, common_1.HttpStatus.UNAUTHORIZED);
        if (updateBanDto.user_id == roomData.owner_id)
            throw new common_1.HttpException({ message: 'You can\'t ban the room crater' }, common_1.HttpStatus.UNAUTHORIZED);
        const bannedUser = await this.findUserInRoom(updateBanDto.room_id, updateBanDto.user_id);
        if (bannedUser) {
            bannedUser.created = Date.now();
            bannedUser.banned = updateBanDto.banned;
            bannedUser.duration = updateBanDto.duration;
            return this.bansRepository.save(bannedUser);
        }
        {
            throw new common_1.HttpException({ error: "Couldn't update, please try again later!" }, common_1.HttpStatus.NOT_MODIFIED);
        }
    }
    async unbanUserFromRoom(sessionId, roomData, roomId, userId) {
        if (roomData.admins.includes(sessionId))
            throw new common_1.HttpException({ message: 'You\'re not an admin of this room!' }, common_1.HttpStatus.UNAUTHORIZED);
        const unBannedUser = await this.findUserInRoom(roomId, userId);
        if (unBannedUser) {
            return this.bansRepository.remove(unBannedUser);
        }
        else {
            throw new common_1.HttpException({ error: "Couldn't update, please try again later!" }, common_1.HttpStatus.NOT_MODIFIED);
        }
    }
};
BanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BanService);
exports.BanService = BanService;
//# sourceMappingURL=ban.service.js.map