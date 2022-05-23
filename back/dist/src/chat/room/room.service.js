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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_message_entity_1 = require("./entities/room-message.entity");
const room_entity_1 = require("./entities/room.entity");
const bcrypt = require("bcrypt");
let RoomService = class RoomService {
    constructor(roomsRepository, roomsMessagesRepository) {
        this.roomsRepository = roomsRepository;
        this.roomsMessagesRepository = roomsMessagesRepository;
    }
    arrayRemove(roomAdmins, userId) {
        return roomAdmins.filter(function (ele) {
            return ele != userId;
        });
    }
    async create(sessionId, createRoomDto) {
        if (createRoomDto.name == undefined || createRoomDto.admins == undefined)
            return;
        let test = await this.roomsRepository.findOne({ name: createRoomDto.name });
        if (test !== undefined) {
            return { status: false, error: 'there exists room with this name!' };
        }
        createRoomDto.admins = [];
        createRoomDto.admins.push(sessionId);
        const newRoom = this.roomsRepository.create(createRoomDto);
        if (newRoom.locked) {
            const saltOrRounds = 10;
            const password = newRoom.password;
            const hash = await bcrypt.hash(password, saltOrRounds);
            newRoom.password = hash;
        }
        else {
            newRoom.password = "";
        }
        newRoom.owner_id = sessionId;
        const data = await this.roomsRepository.save(newRoom);
        if (data) {
            return {
                status: true,
                roomData: data
            };
        }
        else {
            return { status: false, error: 'backend failure' };
        }
    }
    async findRoomMessages(sessionId, excludeUsersList, roomId) {
        let whereBlock;
        if (excludeUsersList.length > 0)
            whereBlock = `AND public."users".id NOT IN ( ${excludeUsersList.join(",")} )`;
        else
            whereBlock = ``;
        const data = await (0, typeorm_2.getConnection)().query(`
			SELECT *  FROM
				public."room_message"
				JOIN
						public."users"
					ON
						public."users".id = public."room_message".from_id
				WHERE public."room_message".room_id = ${roomId} 
				${whereBlock}
				ORDER BY
				public."room_message".id ASC;
		`);
        if (!data)
            throw new common_1.HttpException({ message: 'Room Not Found' }, common_1.HttpStatus.NOT_FOUND);
        return data;
    }
    saveMessageToRoom(sessionId, createRoomMessageDto) {
        const newRoomMessage = this.roomsMessagesRepository.create(createRoomMessageDto);
        newRoomMessage.from_id = sessionId;
        return this.roomsMessagesRepository.save(newRoomMessage);
    }
    findAll() {
        return this.roomsRepository.find();
    }
    async findOne(id) {
        const data = await this.roomsRepository.findOne(id);
        if (!data)
            throw new common_1.HttpException({ message: 'Room Not Found' }, common_1.HttpStatus.NOT_FOUND);
        return data;
    }
    async update(sessionId, id, changePasswordDto) {
        const room = await this.findOne(id);
        if (sessionId != room.owner_id)
            throw new common_1.HttpException({ message: 'You can\'t edit this room!' }, common_1.HttpStatus.UNAUTHORIZED);
        if (changePasswordDto.password == undefined)
            return;
        room.password = changePasswordDto.password;
        if (changePasswordDto.password != "") {
            room.locked = true;
            const saltOrRounds = 10;
            const password = changePasswordDto.password;
            const hash = await bcrypt.hash(password, saltOrRounds);
            room.password = hash;
        }
        else {
            room.locked = false;
        }
        return this.roomsRepository.save(room);
    }
    async remove(sessionId, id) {
        const room = await this.findOne(id);
        if (sessionId != room.owner_id)
            throw new common_1.HttpException({ message: 'You can\'t edit this room!' }, common_1.HttpStatus.UNAUTHORIZED);
        if (room)
            return this.roomsRepository.remove(room);
    }
    async checkAuth(roomId, password) {
        const roomData = await this.findOne(roomId);
        if (!roomData.locked)
            return true;
        else {
            const passwordsMatch = await bcrypt.compare(password, roomData.password);
            if (passwordsMatch)
                return true;
            else
                return false;
        }
    }
    async addRoomAdmin(roomId, userId) {
        const room = await this.findOne(roomId);
        if (!room.admins.includes(userId))
            room.admins.push(userId);
        const data = await this.roomsRepository.save(room);
        if (data)
            return { status: true };
        else
            return { status: false };
    }
    async removeRoomAdmin(roomId, userId) {
        const room = await this.findOne(roomId);
        if (room.admins.includes(userId))
            room.admins = this.arrayRemove(room.admins, userId);
        const data = await this.roomsRepository.save(room);
        if (data)
            return { status: true };
        else
            return { status: false };
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Rooms)),
    __param(1, (0, typeorm_1.InjectRepository)(room_message_entity_1.RoomMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map