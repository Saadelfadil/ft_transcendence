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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_service_1 = require("./app.service");
const _42_authentication_1 = require("./42-authentication");
const auth_guard_1 = require("./auth.guard");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const userFriends_entity_1 = require("./userFriends.entity");
const userGame_entity_1 = require("./userGame.entity");
const userHistory_entity_1 = require("./userHistory.entity");
const speakeasy = require('speakeasy');
let AppController = class AppController {
    constructor(appService, jwtService, userRepository, userFriendsEntity, userGameEntity, userHistoryEntity) {
        this.appService = appService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userFriendsEntity = userFriendsEntity;
        this.userGameEntity = userGameEntity;
        this.userHistoryEntity = userHistoryEntity;
    }
    async getRequests(body) {
        let reqs = [];
        const { id } = body;
        const user = await this.appService.getUserByIdFriend(id);
        await Promise.all(user.user_requested.map(async (index) => {
            const { login } = await this.appService.getUserById(index);
            reqs.push({ id: index, login: login });
        }));
        return reqs;
    }
    async getFriends(body) {
        let reqs = [];
        const { id } = body;
        const user = await this.appService.getUserByIdFriend(id);
        await Promise.all(user.user_friends.map(async (index) => {
            const { login } = await this.appService.getUserById(index);
            reqs.push({ id: index, login: login });
        }));
        return reqs;
    }
    async addFriend(body) {
        const { login, user_id } = body;
        let tmp = false;
        try {
            const { id } = await this.appService.getUserByLogin(login);
            const { user_requested, user_friends } = await this.appService.getUserByIdFriend(id);
            if (id === user_id)
                return false;
            user_friends.map((curId) => {
                if (curId === user_id) {
                    tmp = true;
                    return;
                }
            });
            if (tmp)
                return true;
            tmp = false;
            user_requested.map((curId) => {
                if (curId === user_id) {
                    tmp = true;
                    return;
                }
            });
            if (!tmp) {
                user_requested.push(user_id);
                await this.userFriendsEntity.update(id, { user_requested: user_requested });
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async removeFriend(body) {
        const { user_id, friend_id } = body;
        try {
            const userFriend = await this.appService.getUserByIdFriend(user_id);
            const { user_friends } = await this.appService.getUserByIdFriend(friend_id);
            userFriend.user_friends.map((curId, index) => {
                if (curId === friend_id) {
                    userFriend.user_friends.splice(index, 1);
                    return;
                }
            });
            user_friends.map((curId, index) => {
                if (curId === user_id) {
                    user_friends.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(user_id, { user_friends: userFriend.user_friends });
            await this.userFriendsEntity.update(friend_id, { user_friends: user_friends });
        }
        catch (error) {
        }
    }
    async RequestToFriend(body) {
        const { is_accept, user_id, request_user_id } = body;
        if (is_accept) {
            const userFriendRequest = await this.appService.getUserByIdFriend(request_user_id);
            const { user_friends, user_requested } = await this.appService.getUserByIdFriend(user_id);
            user_friends.push(request_user_id);
            userFriendRequest.user_friends.push(user_id);
            user_requested.map((id, index) => {
                if (id === request_user_id) {
                    user_requested.splice(index, 1);
                    return;
                }
            });
            userFriendRequest.user_requested.map((id, index) => {
                if (id === user_id) {
                    userFriendRequest.user_requested.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(user_id, { user_friends: user_friends, user_requested: user_requested });
            await this.userFriendsEntity.update(request_user_id, { user_friends: userFriendRequest.user_friends, user_requested: userFriendRequest.user_requested });
        }
        else {
            const { user_requested } = await this.appService.getUserByIdFriend(user_id);
            user_requested.map((id, index) => {
                if (id === request_user_id) {
                    user_requested.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(user_id, { user_requested: user_requested });
        }
    }
    profile(request) {
        return this.appService.getUserDataFromJwt(request);
    }
    async loginOrNot(request, query) {
        try {
            const user = await this.appService.getUserDataFromJwt(request);
            return { is_login_db: user.is_login, id: user.id };
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async updateU(request, body) {
        try {
            return this.appService.updateUser(request, body);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async verify(request, body) {
        try {
            const { token } = request.body;
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data)
                throw new common_1.UnauthorizedException();
            const user = this.appService.getUserById(data['id']);
            const verified = speakeasy.totp.verify({
                secret: (await user).twof_secret,
                encoding: 'base32',
                token
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async validate(request) {
        try {
            const { twof_qrcode, change, twof } = request.body;
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data)
                throw new common_1.UnauthorizedException();
            const user = await this.appService.getUserById(data['id']);
            const tokenValidate = speakeasy.totp.verify({
                secret: (await user).twof_secret,
                encoding: 'base32',
                token: twof_qrcode,
                window: 1
            });
            if (tokenValidate) {
                await this.userRepository.update(user.id, { is_login: false });
                if (!change) {
                    let tmp_store;
                    let img_url;
                    if (!twof) {
                        let twof_secret = speakeasy.generateSecret();
                        let twof_qrcode;
                        tmp_store = twof_secret.base32;
                        twof_secret = twof_secret.otpauth_url;
                        twof_qrcode = await this.appService.generateQR(twof_secret);
                        twof_qrcode = await this.appService.uploadImage(twof_qrcode);
                        img_url = twof_qrcode;
                        await this.userRepository.update(user.id, { twof: twof, twof_secret: tmp_store, twof_qrcode: twof_qrcode });
                    }
                    await this.userRepository.update(user.id, { twof: twof });
                    if (!twof)
                        return { success: true, twof_qrcode: img_url, twof_secret: tmp_store };
                }
                return { success: true };
            }
            return { sucess: false };
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async getData(code, response) {
        const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
        const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
        const REDIRECT_URI = "http://localhost:8080/login";
        var appp = new _42_authentication_1.default(UID, SECRET, REDIRECT_URI);
        var token = await appp.get_Access_token(code);
        const userData = await appp.get_user_data(token.access_token);
        const { id, email, login, image_url } = userData;
        const userDb = await this.appService.getUserById(id);
        if (!userDb) {
            let twof_secret = speakeasy.generateSecret();
            let twof_qrcode;
            let tmp_store = twof_secret.base32;
            twof_secret = twof_secret.otpauth_url;
            twof_qrcode = await this.appService.generateQR(twof_secret);
            twof_qrcode = await this.appService.uploadImage(twof_qrcode);
            const twof = false;
            this.appService.create({
                id,
                email,
                login,
                image_url,
                twof,
                twof_secret: tmp_store,
                twof_qrcode
            });
            await this.userGameEntity.save({
                id,
                wins: 0,
                loses: 0,
                score: 0
            });
            await this.userFriendsEntity.save({
                id,
                user_friends: [],
                user_blocked: [],
                user_requested: []
            });
        }
        await this.userRepository.update(id, { is_login: true });
        if (userData.error === undefined) {
            const jwt = await this.jwtService.signAsync({ id: id });
            response.cookie('jwt', jwt, { httpOnly: true });
            return jwt;
        }
    }
    async user(request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data)
                throw new common_1.UnauthorizedException();
            const user = await this.appService.getUserById(data['id']);
            const { wins, loses } = await this.appService.getUserByIdGame(data['id']);
            user.wins = wins;
            user.loses = loses;
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async allUser(body) {
        let users = [];
        const { usersId } = body;
        await Promise.all(usersId.map(async (index) => {
            const { id, login, image_url } = await this.appService.getUserById(index);
            users.push({ id, login, image_url });
        }));
        return users;
    }
    async logout(response) {
        response.clearCookie('jwt');
        return "Cookies Clean";
    }
};
__decorate([
    (0, common_1.Post)('getrequests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Post)('getfriends'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('addfriend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Post)('removefriend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Post)('requesttofriend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "RequestToFriend", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "profile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Get)('islogin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginOrNot", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateU", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "verify", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('code')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getData", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('getusers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "allUser", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logout", null);
AppController = __decorate([
    (0, common_1.Controller)('api'),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __param(3, (0, typeorm_2.InjectRepository)(userFriends_entity_1.UserFriendsEntity)),
    __param(4, (0, typeorm_2.InjectRepository)(userGame_entity_1.UserGameEntity)),
    __param(5, (0, typeorm_2.InjectRepository)(userHistory_entity_1.UserHistoryEntity)),
    __metadata("design:paramtypes", [app_service_1.AppService, jwt_1.JwtService, typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _d : Object])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map