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
    async getRequests(request) {
        let reqs = [];
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined)
            return;
        const user = await this.appService.getUserByIdFriend(userJwt.id);
        await Promise.all(user.user_requested.map(async (index) => {
            const { login } = await this.appService.getUserById(index);
            reqs.push({ id: index, login: login });
        }));
        return reqs;
    }
    async getFriends(request) {
        let reqs = [];
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined)
            return;
        const user = await this.appService.getUserByIdFriend(userJwt.id);
        await Promise.all(user.user_friends.map(async (index) => {
            const { login } = await this.appService.getUserById(index);
            reqs.push({ id: index, login: login });
        }));
        return reqs;
    }
    async addFriend(body, request) {
        console.log('addfriend used');
        const { login } = body;
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined)
            return;
        let tmp = false;
        try {
            const { id } = await this.appService.getUserByLogin(login);
            const { user_requested, user_friends } = await this.appService.getUserByIdFriend(id);
            if (id === userJwt.id)
                return false;
            user_friends.map((curId) => {
                if (curId === userJwt.id) {
                    tmp = true;
                    return;
                }
            });
            if (tmp)
                return true;
            tmp = false;
            user_requested.map((curId) => {
                if (curId === userJwt.id) {
                    tmp = true;
                    return;
                }
            });
            if (!tmp) {
                user_requested.push(userJwt.id);
                await this.userFriendsEntity.update(id, { user_requested: user_requested });
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async removeFriend(body, request) {
        const { friend_id } = body;
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined)
            return;
        try {
            const userFriend = await this.appService.getUserByIdFriend(userJwt.id);
            const { user_friends } = await this.appService.getUserByIdFriend(friend_id);
            userFriend.user_friends.map((curId, index) => {
                if (curId === friend_id) {
                    userFriend.user_friends.splice(index, 1);
                    return;
                }
            });
            user_friends.map((curId, index) => {
                if (curId === userJwt.id) {
                    user_friends.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(userJwt.id, { user_friends: userFriend.user_friends });
            await this.userFriendsEntity.update(friend_id, { user_friends: user_friends });
        }
        catch (error) {
        }
    }
    async RequestToFriend(body, request) {
        const { is_accept, request_user_id } = body;
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined || is_accept == undefined || request_user_id == undefined)
            return;
        if (is_accept) {
            const userFriendRequest = await this.appService.getUserByIdFriend(request_user_id);
            const { user_friends, user_requested } = await this.appService.getUserByIdFriend(userJwt.id);
            user_friends.push(request_user_id);
            userFriendRequest.user_friends.push(userJwt.id);
            user_requested.map((id, index) => {
                if (id === request_user_id) {
                    user_requested.splice(index, 1);
                    return;
                }
            });
            userFriendRequest.user_requested.map((id, index) => {
                if (id === userJwt.id) {
                    userFriendRequest.user_requested.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(userJwt.id, { user_friends: user_friends, user_requested: user_requested });
            await this.userFriendsEntity.update(request_user_id, { user_friends: userFriendRequest.user_friends, user_requested: userFriendRequest.user_requested });
        }
        else {
            const { user_requested } = await this.appService.getUserByIdFriend(userJwt.id);
            user_requested.map((id, index) => {
                if (id === request_user_id) {
                    user_requested.splice(index, 1);
                    return;
                }
            });
            await this.userFriendsEntity.update(userJwt.id, { user_requested: user_requested });
        }
    }
    async loginOrNot(request) {
        try {
            const user = await this.appService.getUserDataFromJwt(request);
            if (user == undefined)
                return;
            return { is_login_db: user.is_login, id: user.id, image_url: user.image_url, login: user.login, status: true };
        }
        catch (error) {
            return { status: false };
        }
    }
    async updateU(request, body) {
        try {
            const user = await this.appService.updateUser(request, body);
            return user;
        }
        catch (error) {
        }
    }
    async amIJoinedToThisRoom(request, body) {
        const user = await this.appService.getUserDataFromJwt(request);
        if (user == undefined)
            return;
        const { joinedRooms } = await this.appService.getUserById(user.id);
        let status = joinedRooms.includes(body.room_id);
        return { status: status };
    }
    async verify(request, body) {
        try {
            const { token } = request.body;
            if (token == undefined)
                return;
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
            if (twof_qrcode == undefined || change == undefined || twof == undefined)
                return;
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
    async getgamestate(request) {
        const userJwt = await this.appService.getUserDataFromJwt(request);
        if (userJwt.id == undefined)
            return;
        const gameStatus = await this.appService.getUserById(userJwt.id);
        const { in_game } = gameStatus;
        return { in_game: in_game };
    }
    async getData(code, response) {
        const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
        const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
        const REDIRECT_URI = "http://localhost:8080/login";
        if (code == undefined)
            return;
        var appp = new _42_authentication_1.default(UID, SECRET, REDIRECT_URI);
        var token = await appp.get_Access_token(code);
        if (token == undefined)
            return;
        const userData = await appp.get_user_data(token.access_token);
        if (userData == undefined)
            return;
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
                twof_qrcode,
                joinedRooms: []
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
            if (user == undefined)
                return;
            user.wins = user.wins;
            user.loses = user.loss;
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async allUser(body) {
        let match;
        let users = [];
        const { usersId } = body;
        if (usersId == undefined)
            return;
        let tmp;
        const length = usersId.length;
        for (let i = 0; i < length; i += 2) {
            const user = await this.appService.getUserById(usersId[i]);
            if (user == undefined)
                return;
            const { id, login, image_url } = user;
            tmp = await this.appService.getUserById(usersId[i + 1]);
            if (tmp == undefined)
                return;
            users.push({ left_player: { id: id, login: login, image_url: image_url }, right_player: { id: tmp.id, login: tmp.login, image_url: tmp.image_url } });
        }
        return users;
    }
    async retUsersList(body) {
        let SingleUser;
        let users = [];
        const { usersId } = body;
        if (usersId == undefined)
            return;
        await Promise.all(usersId.map(async (user_id) => {
            const { login, id } = await this.appService.getUserById(user_id);
            users.push({ login: login, id: id });
        }));
        return { users: users };
    }
    async users() {
        const query = this.userRepository.createQueryBuilder('UserEntity');
        const matchs = await query.getMany();
        console.log(matchs);
        return matchs;
    }
    async getExactUser(body, request) {
        let tmp = false;
        const { friend_id } = body;
        const userJwt = await this.appService.getUserDataFromJwt(request);
        console.log(friend_id);
        if (userJwt.id == undefined || friend_id == undefined)
            return;
        const { login, image_url, wins, loss } = await this.appService.getUserById(friend_id);
        const { user_friends } = await this.appService.getUserByIdFriend(userJwt.id);
        user_friends.map((fr_id) => {
            if (fr_id === friend_id) {
                tmp = true;
                return;
            }
        });
        if (!tmp) {
            const { user_requested } = await this.appService.getUserByIdFriend(friend_id);
            user_requested.map((fr_id) => {
                if (fr_id === userJwt.id) {
                    tmp = true;
                    return;
                }
            });
        }
        return { login: login, image_url: image_url, is_friend: tmp, wins: wins, loses: loss };
    }
    async getloginbyid(body) {
        const { id } = body;
        if (id == undefined)
            return;
        const { login, image_url } = await this.appService.getUserById(id);
        return { login: login, image_url: image_url };
    }
    async getUserJoindAndBlocked(body) {
        const { id } = body;
        if (id == undefined)
            return;
        const { joinedRooms } = await this.appService.getUserById(id);
        return { joinedRooms: joinedRooms };
    }
    async FindUserByLogin(body) {
        const { login } = body;
        if (login == undefined)
            return;
        try {
            const { id } = await this.appService.getUserByLogin(login);
            return { status: true, id: id };
        }
        catch (e) {
            return { status: false, id: -1 };
        }
    }
    async logout(response) {
        response.clearCookie('jwt');
        return "Cookies Clean";
    }
};
__decorate([
    (0, common_1.Post)('getrequests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Post)('getfriends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('addfriend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Post)('removefriend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Post)('requesttofriend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "RequestToFriend", null);
__decorate([
    (0, common_1.Get)('islogin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    (0, common_1.Post)('amijoinedtoroom'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "amIJoinedToThisRoom", null);
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
    (0, common_1.Post)('getgamestatus'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getgamestate", null);
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
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('getusers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "allUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('listofusers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "retUsersList", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "users", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('exactuser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getExactUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('getloginbyid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getloginbyid", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthenticatedGuard),
    (0, common_1.Post)('joinedRooms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserJoindAndBlocked", null);
__decorate([
    (0, common_1.Post)('userbylogin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "FindUserByLogin", null);
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
    __metadata("design:paramtypes", [app_service_1.AppService, jwt_1.JwtService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map