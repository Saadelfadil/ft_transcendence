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
exports.LevelUpGateway = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_entity_1 = require("../../users/user.entity");
const typeorm_2 = require("typeorm");
const game_interface_1 = require("../game.interface");
const game_repository_1 = require("../game.repository");
const game_levelup_logic_1 = require("./game.levelup.logic");
let LevelUpGateway = class LevelUpGateway {
    constructor(gameRepository, matchRepository, userRepository, levelUpLogic) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.levelUpLogic = levelUpLogic;
        this.logger = new common_1.Logger('GameGateway');
    }
    afterInit(server) {
        this.logger.log(`server io initiatted ${server}`);
    }
    handleDisconnect(client) {
        console.log('-----disconnect socket (levelup)------');
        console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
        if (client.data.node) {
            if (client.data.node.time < this.levelUpLogic.time && client.data.node.first_logout === '') {
                client.data.node.first_logout = client.data.pos;
                console.log('first: ', client.data.pos);
            }
        }
        this.clear(client);
        console.log(`wRooms: ${this.levelUpLogic.wRooms.size}`);
        console.log(`Rooms: ${this.levelUpLogic.rooms.size}`);
        console.log('-----end of disconnect socket ------\n');
    }
    checkRoomconnection(client) {
        let room = this.levelUpLogic.joinRoom(client);
        if (room) {
            let timer = 5;
            this.server.to(room.id).emit('connectedToRoom', timer, room.players);
            setTimeout(() => {
                this.server.to(room.id).emit('roomCreated', room.id, room.players);
            }, timer * 1000);
        }
        else {
            client.emit('waitingForRoom', client.data.pos);
        }
    }
    handleConnection(client, ...args) {
        console.log('-----connect socket (levelup)------');
        console.log(`connect: ${client.id}`);
        console.log('-----end of connect socket ------\n');
    }
    initGame(client) {
        this.levelUpLogic.initGmae();
        client.data.node.playerLeft = this.levelUpLogic.playerLeft;
        client.data.node.playerRight = this.levelUpLogic.playerRight;
        client.data.node.ball = this.levelUpLogic.ball;
        console.log(client.data.node);
        client.emit("initData", {
            pl: client.data.node.playerLeft,
            pr: client.data.node.playerRight,
            b: client.data.node.ball,
            scw: this.levelUpLogic.canvasW,
            sch: this.levelUpLogic.canvasH,
        });
    }
    updatePos(client, curspos) {
        if (client.data.pos === 'left') {
            client.data.node.playerLeft.y = curspos - client.data.node.playerLeft.h / 2;
        }
        else if (client.data.pos === 'right') {
            client.data.node.playerRight.y = curspos - client.data.node.playerRight.h / 2;
        }
    }
    setRoom(client, room) {
        client.data.room = room;
        let node = this.levelUpLogic.rooms.find(Number(client.data.room));
        if (node) {
            client.data.roomStatus = 'play';
            client.data.node = node.data;
            console.log(client.data.node);
            client.emit('startMouseEvent');
            console.log('mouse event sended');
            if (client.data.pos === 'left') {
                let newDbRoom = {};
                newDbRoom.name = client.data.node.id;
                newDbRoom.players = client.data.node.players;
                newDbRoom.namespace = 'levelup';
                this.gameRepository.addRoom(newDbRoom);
                this.startGame(client);
            }
        }
    }
    clientType(client, data) {
        client.data.userId = data.userId;
        client.data.type = data.type;
        if (data.type === 'play') {
            this.userRepository.update(client.data.userId, { in_game: true });
            client.data.node = new game_interface_1.roomNode();
            client.data.room = '';
            client.data.roomStatus = 'waiting';
            this.initGame(client);
            this.checkRoomconnection(client);
        }
        else if (data.type === 'stream') {
            console.log(data.room, 'stream');
            client.data.room = data.room;
            if (!this.levelUpLogic.rooms.find(Number(data.room))) {
                console.log("no room");
                client.emit('noRoom');
                return;
            }
            client.join(data.room);
            client.emit('canvasWH', { scw: this.levelUpLogic.canvasW, sch: this.levelUpLogic.canvasH });
        }
    }
    clear(client) {
        if (client.data.type === 'stream') {
            client.leave(client.data.room);
            client.emit('leaveRoom');
        }
        else {
            if (client.data.roomStatus === 'waiting') {
                this.server.to(client.data.room).emit('leaveRoom');
                this.userRepository.update(client.data.userId, { in_game: false });
                this.levelUpLogic.wRooms.remove(Number(client.data.room));
            }
            else if (client.data.roomStatus === 'play') {
                console.log('clear ***');
                if (client.data.node.first_logout === "left") {
                    client.data.node.playerLeft.score = 0;
                    client.data.node.playerRight.score = 10;
                }
                else if (client.data.node.first_logout === "right") {
                    client.data.node.playerRight.score = 0;
                    client.data.node.playerLeft.score = 10;
                }
                this.server.to(client.data.room).emit("updateClient", {
                    pl: client.data.node.playerLeft,
                    pr: client.data.node.playerRight,
                    b: client.data.node.ball,
                });
                client.leave(client.data.room);
                this.server.to(client.data.room).emit('leaveRoom');
                clearInterval(client.data.node.gameLoop);
                clearInterval(client.data.node.gameTimer);
                if (client.data.pos === 'left') {
                    console.log(client.data.node.playerLeft.score);
                    console.log(client.data.node.playerRight.score);
                    console.log(client.data.node.first_logout);
                    this.matchRepository.addMatchData(client.data.node, 'levelup');
                    if (client.data.node.playerLeft.score > client.data.node.playerRight.score) {
                        this.userRepository.createQueryBuilder()
                            .update(user_entity_1.UserEntity).set({
                            points: () => "points + 3",
                            wins: () => "wins + 1"
                        }).where("id = :id", { id: client.data.node.players[0] }).execute();
                        this.userRepository.createQueryBuilder()
                            .update(user_entity_1.UserEntity).set({
                            loss: () => "loss + 1"
                        }).where("id = :id", { id: client.data.node.players[1] }).execute();
                    }
                    else if (client.data.node.playerLeft.score < client.data.node.playerRight.score) {
                        this.userRepository.createQueryBuilder()
                            .update(user_entity_1.UserEntity).set({
                            points: () => "points + 3",
                            wins: () => "wins + 1"
                        }).where("id = :id", { id: client.data.node.players[1] }).execute();
                        this.userRepository.createQueryBuilder()
                            .update(user_entity_1.UserEntity).set({
                            loss: () => "loss + 1"
                        }).where("id = :id", { id: client.data.node.players[0] }).execute();
                    }
                    else {
                        this.userRepository.createQueryBuilder()
                            .update(user_entity_1.UserEntity).set({
                            points: () => "points + 1"
                        }).where("id = :id0 AND id = :id1", { id0: client.data.node.players[0], id1: client.data.node.players[1] }).execute();
                    }
                    this.userRepository.update(Number(client.data.node.players[0]), { in_game: false });
                    this.userRepository.update(Number(client.data.node.players[1]), { in_game: false });
                }
                this.levelUpLogic.rooms.remove(Number(client.data.room));
                this.gameRepository.deleteRoom(client.data.room);
            }
        }
    }
    startGame(client) {
        this.startTime(client);
        client.data.node.gameLoop = setInterval(() => {
            this.levelUpLogic.update(client.data);
            this.server.to(client.data.room).emit("updateClient", {
                pl: client.data.node.playerLeft,
                pr: client.data.node.playerRight,
                b: client.data.node.ball,
            });
        }, 1000 / 64);
    }
    startTime(client) {
        let start = Date.now();
        client.data.node.gameTimer = setInterval(() => {
            let delta = Date.now() - start;
            let timer = Math.floor(delta / 1000);
            client.data.node.time = timer;
            if (client.data.node.time % 5 === 0) {
                console.log("levelup");
                client.data.node.ball.speed += 0.25;
                client.data.node.playerLeft.h -= 2.5;
                client.data.node.playerRight.h -= 2.5;
            }
            this.server.to(client.data.room).emit("updateTime", client.data.node.time);
            if (timer === this.levelUpLogic.time) {
                clearInterval(client.data.node.gameTimer);
                clearInterval(client.data.node.gameLoop);
                this.server.to(client.data.room).emit('leaveRoom');
            }
            console.log(timer);
        }, 1000);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LevelUpGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('initGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LevelUpGateway.prototype, "initGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updatePos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], LevelUpGateway.prototype, "updatePos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('setRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LevelUpGateway.prototype, "setRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('clientType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LevelUpGateway.prototype, "clientType", null);
LevelUpGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'levelup',
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
        game_levelup_logic_1.LevelUpLogic])
], LevelUpGateway);
exports.LevelUpGateway = LevelUpGateway;
//# sourceMappingURL=game.levelup.gateway.js.map