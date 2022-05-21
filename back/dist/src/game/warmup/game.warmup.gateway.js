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
exports.WarmUpGateway = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_entity_1 = require("../../users/user.entity");
const typeorm_2 = require("typeorm");
const game_interface_1 = require("../game.interface");
const game_repository_1 = require("../game.repository");
const game_warmup_logic_1 = require("./game.warmup.logic");
let WarmUpGateway = class WarmUpGateway {
    constructor(gameRepository, matchRepository, userRepository, warmUp) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.warmUp = warmUp;
        this.logger = new common_1.Logger('WarmUp');
    }
    afterInit(server) {
        this.logger.log(`server io initiatted ${server}`);
    }
    handleDisconnect(client) {
        console.log('-----disconnect socket ------');
        console.log(`disconnect: ${client.id}`);
        if (client.data.type === 'stream') {
            client.leave(client.data.room);
        }
        else {
            this.stopTime(client);
            this.stopGame(client);
            this.gameRepository.deleteRoom(client.id);
            let matchData = new game_interface_1.roomNode();
            matchData.id = client.data.id;
            matchData.playerLeft = client.data.playerLeft;
            matchData.playerRight = client.data.playerRight;
            matchData.players = [client.data.userId, '0'];
            this.userRepository.update(client.data.userId, { in_game: false });
            this.matchRepository.addMatchData(matchData, 'warmup');
        }
        console.log('-----end of disconnect socket ------\n');
    }
    handleConnection(client, ...args) {
        console.log('-----connect socket (warmap) ------');
        console.log(`connect: ${client.id}`);
        console.log('-----end of connect socket ------\n');
    }
    clientType(client, data) {
        client.data.type = data.type;
        if (data.type === 'stream') {
            console.log(data.room);
            client.data.room = data.room;
            client.join(data.room);
            client.emit('canvasWH', { scw: this.warmUp.canvasW, sch: this.warmUp.canvasH });
        }
    }
    initGame(client, clientData) {
        client.data.userId = clientData.userId;
        this.userRepository.update(client.data.userId, { in_game: true });
        this.warmUp.initGmae();
        client.data.playerLeft = this.warmUp.playerLeft;
        client.data.playerRight = this.warmUp.playerRight;
        client.data.ball = this.warmUp.ball;
        client.emit("initData", {
            pl: client.data.playerLeft,
            pr: client.data.playerRight,
            b: client.data.ball,
            scw: this.warmUp.canvasW,
            sch: this.warmUp.canvasH,
        });
        console.log('done init gme');
    }
    startTime(client) {
        let start = Date.now();
        client.data.interval = setInterval(() => {
            let delta = Date.now() - start;
            client.data.timer = Math.floor(delta / 1000);
            client.emit("updateTime", client.data.timer);
            console.log(client.data.timer);
        }, 1000);
    }
    startGame(client) {
        let newDbRoom = {};
        newDbRoom.name = client.id;
        newDbRoom.players = [client.data.userId, '0'];
        newDbRoom.namespace = 'warmup';
        this.gameRepository.addRoom(newDbRoom);
        client.data.gameLoop = setInterval(() => {
            this.warmUp.update(client.data);
            this.server.to(client.id).emit("updateClient", {
                pl: client.data.playerLeft,
                pr: client.data.playerRight,
                b: client.data.ball,
                scw: this.warmUp.canvasW,
                sch: this.warmUp.canvasH,
            });
        }, 1000 / 65);
    }
    stopGame(client) {
        clearInterval(client.data.gameLoop);
    }
    stopTime(client) {
        clearInterval(client.data.interval);
    }
    updatePos(client, curspos) {
        client.data.playerLeft.y = curspos - client.data.playerLeft.h / 2;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WarmUpGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('clientType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "clientType", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('initGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "initGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startTime'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "startTime", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "startGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "stopGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopTime'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "stopTime", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updatePos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], WarmUpGateway.prototype, "updatePos", null);
WarmUpGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'warmup',
        cors: {
            origin: '*',
        }
    }),
    __param(0, (0, typeorm_1.InjectRepository)(game_repository_1.GameRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(game_repository_1.MatchRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [game_repository_1.GameRepository,
        game_repository_1.MatchRepository,
        typeorm_2.Repository,
        game_warmup_logic_1.WarmUpLogic])
], WarmUpGateway);
exports.WarmUpGateway = WarmUpGateway;
//# sourceMappingURL=game.warmup.gateway.js.map