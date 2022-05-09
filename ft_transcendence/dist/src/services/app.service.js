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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const cloudinary_1 = require("../utils/cloudinary");
const userFriends_entity_1 = require("../entities/userFriends.entity");
const userGame_entity_1 = require("../entities/userGame.entity");
const userHistory_entity_1 = require("../entities/userHistory.entity");
const QRCode = require('qrcode');
let AppService = class AppService {
    constructor(userRepository, userFriendsEntity, userGameEntity, userHistoryEntity, jwtService) {
        this.userRepository = userRepository;
        this.userFriendsEntity = userFriendsEntity;
        this.userGameEntity = userGameEntity;
        this.userHistoryEntity = userHistoryEntity;
        this.jwtService = jwtService;
    }
    googleLogin(req) {
        if (!req.user)
            throw new common_1.NotFoundException();
        return { user: req.user };
    }
    async create(data) {
        return this.userRepository.save(data);
    }
    async getUserByLogin(login) {
        const user = await this.userRepository.findOne({ login });
        return user;
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne(id).then((user) => {
            return user;
        });
        return user;
    }
    async getUserByIdFriend(id) {
        const user = await this.userFriendsEntity.findOne(id).then((user) => {
            return user;
        });
        return user;
    }
    async getUserByIdGame(id) {
        const user = await this.userGameEntity.findOne(id).then((user) => {
            return user;
        });
        return user;
    }
    async getUserByIdHistory(id) {
        const user = await this.userHistoryEntity.findOne(id).then((user) => {
            return user;
        });
        return user;
    }
    async getUserDataFromJwt(request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data)
                throw new common_1.UnauthorizedException();
            const user = this.getUserById(data['id']);
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async generateQR(text) {
        try {
            return QRCode.toDataURL(text);
        }
        catch (error) {
            console.error(error);
        }
    }
    async uploadImage(twof_qrcode) {
        const fileStr = twof_qrcode;
        const uploadedResponse = await cloudinary_1.default.uploader.upload(fileStr, {
            upload_preset: 'ft_transcendence'
        });
        return uploadedResponse.secure_url;
    }
    async updateUser(request, body) {
        const user = await this.getUserDataFromJwt(request);
        const userDb = await this.getUserByLogin(body.login);
        if (userDb)
            throw new common_1.UnauthorizedException();
        if ((body.login) != null) {
            await this.userRepository.update(user.id, { login: body.login });
        }
        if (body.image_url != null) {
            try {
                const fileStr = body.image_url;
                const uploadedResponse = await cloudinary_1.default.uploader.upload(fileStr, {
                    upload_preset: 'ft_transcendence'
                });
                await this.userRepository.update(user.id, { image_url: uploadedResponse.secure_url });
                return { image_url: uploadedResponse.secure_url };
            }
            catch (error) {
                console.error(error);
            }
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(userFriends_entity_1.UserFriendsEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(userGame_entity_1.UserGameEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(userHistory_entity_1.UserHistoryEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, jwt_1.JwtService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map