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
exports.oneVoneGateway = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_entity_1 = require("../../users/user.entity");
const typeorm_2 = require("typeorm");
const game_repository_1 = require("../game.repository");
const game_1v1_logic_1 = require("./game.1v1.logic");
let oneVoneGateway = class oneVoneGateway {
    constructor(gameRepository, matchRepository, userRepository, oneVoneLogic) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.oneVoneLogic = oneVoneLogic;
        this.logger = new common_1.Logger('onevone');
    }
    afterInit(server) {
        this.logger.log(`server io initiatted ${server}`);
    }
    handleConnection(client, ...args) {
        console.log('-----connect socket (onevone)------');
        console.log(`connect: ${client.id}`);
        console.log('-----end of connect socket ------\n');
    }
    handleDisconnect(client) {
        console.log('-----disconnect socket (onevone)------');
        console.log(`disconnect: ${client.id}`);
        this.clear(client);
        console.log(this.oneVoneLogic.rooms.size);
        console.log('-----end of disconnect socket ------\n');
    }
    clear(client) {
        if (client.data.type === 'stream') {
            client.leave(client.data.room);
            client.emit('leaveRoom');
        }
        else {
            client.leave(client.data.room);
            this.server.to(client.data.room).emit('leaveRoom');
            if (client.data.roomNode) {
                clearInterval(client.data.roomNode.gameLoop);
                clearInterval(client.data.roomNode.gameTimer);
            }
            if (client.data.pos === 'right') {
                console.log('add data', client.data.roomNode);
                this.matchRepository.addMatchData(client.data.roomNode, 'onevone');
                if (client.data.roomNode.playerLeft.score > client.data.roomNode.playerRight.score) {
                    this.userRepository.createQueryBuilder()
                        .update(user_entity_1.UserEntity).set({
                        points: () => "points + 3",
                        wins: () => "wins + 1"
                    }).where("id = :id", { id: client.data.roomNode.players[0] }).execute();
                    this.userRepository.createQueryBuilder()
                        .update(user_entity_1.UserEntity).set({
                        loss: () => "loss + 1"
                    }).where("id = :id", { id: client.data.roomNode.players[1] }).execute();
                }
                else if (client.data.roomNode.playerLeft.score < client.data.roomNode.playerRight.score) {
                    this.userRepository.createQueryBuilder()
                        .update(user_entity_1.UserEntity).set({
                        points: () => "points + 3",
                        wins: () => "wins + 1"
                    }).where("id = :id", { id: client.data.roomNode.players[1] }).execute();
                    this.userRepository.createQueryBuilder()
                        .update(user_entity_1.UserEntity).set({
                        loss: () => "loss + 1"
                    }).where("id = :id", { id: client.data.roomNode.players[0] }).execute();
                }
                else {
                    this.userRepository.createQueryBuilder()
                        .update(user_entity_1.UserEntity).set({
                        points: () => "points + 1"
                    }).where("id = :id0 AND id = :id1", { id0: client.data.roomNode.players[0], id1: client.data.roomNode.players[1] }).execute();
                }
                this.userRepository.update(Number(client.data.roomNode.players[0]), { in_game: false });
                this.userRepository.update(Number(client.data.roomNode.players[1]), { in_game: false });
            }
            this.gameRepository.deleteRoom(client.data.room);
            this.oneVoneLogic.rooms.remove(Number(client.data.room));
        }
    }
    initData(client) {
        client.emit('initData', {
            pl: client.data.roomNode.playerLeft,
            pr: client.data.roomNode.playerRight,
            b: client.data.roomNode.ball,
            scw: this.oneVoneLogic.canvasW,
            sch: this.oneVoneLogic.canvasH,
        });
    }
    setRoom(client, data) {
        client.data.pos = data.pos;
        client.data.room = data.room;
        client.data.userId = data.id;
        if (client.data.pos === 'left') {
            client.data.roomNode = this.oneVoneLogic.addRoom(client);
            this.initData(client);
            console.log(`${client.id}: ${client.data.pos} set room: ${client.data.room}.`);
            console.log(client.data.roomNode);
        }
        else if (client.data.pos === 'right') {
            let node = this.oneVoneLogic.rooms.find(Number(client.data.room));
            if (node) {
                node.data.size++;
                node.data.players.push(client.data.userId);
                client.join(node.data.id);
                client.data.roomNode = node.data;
                this.initData(client);
                let timer = 5;
                this.server.to(client.data.room).emit('rightJoined', timer, client.data.roomNode.players);
                setTimeout(() => {
                    this.server.to(client.data.room).emit('startMouseEvent');
                }, timer * 1000);
                console.log(`${client.id}: ${client.data.pos} join the room: ${client.data.room}.`);
                console.log(client.data.roomNode);
                this.startGame(client);
                let newDbRoom = {};
                newDbRoom.name = client.data.roomNode.id;
                newDbRoom.players = client.data.roomNode.players;
                newDbRoom.namespace = 'onevone';
                this.gameRepository.addRoom(newDbRoom);
                this.userRepository.update(Number(client.data.roomNode.players[0]), { in_game: true });
                this.userRepository.update(Number(client.data.roomNode.players[1]), { in_game: true });
            }
            else {
                client.data.pos = '';
                client.emit('noRoom');
            }
        }
    }
    clientType(client, data) {
        client.data.type = data.type;
        client.data.room = data.room;
        if (data.type === 'stream') {
            client.join(data.room);
            client.emit('canvasWH', { scw: this.oneVoneLogic.canvasW, sch: this.oneVoneLogic.canvasH });
        }
    }
    startGame(client) {
        this.startTime(client);
        client.data.roomNode.gameLoop = setInterval(() => {
            this.oneVoneLogic.update(client.data);
            this.server.to(client.data.room).emit("updateClient", {
                pl: client.data.roomNode.playerLeft,
                pr: client.data.roomNode.playerRight,
                b: client.data.roomNode.ball,
            });
        }, 1000 / 64);
    }
    startTime(client) {
        let start = Date.now();
        console.log('start time', client.data.roomNode);
        client.data.roomNode.gameTimer = setInterval(() => {
            let delta = Date.now() - start;
            let timer = Math.floor(delta / 1000);
            client.data.roomNode.time = timer;
            if (client.data.roomNode.time % 5 === 0) {
                console.log("1v1");
                client.data.roomNode.ball.speed += 0.25;
                client.data.roomNode.playerLeft.h -= 2.5;
                client.data.roomNode.playerRight.h -= 2.5;
            }
            this.server.to(client.data.room).emit("updateTime", client.data.roomNode.time);
            if (timer === this.oneVoneLogic.time) {
                clearInterval(client.data.roomNode.gameTimer);
                clearInterval(client.data.roomNode.gameLoop);
                this.server.to(client.data.room).emit('leaveRoom');
            }
            console.log(timer);
        }, 1000);
    }
    updatePos(client, curspos) {
        if (client.data.pos === 'left') {
            client.data.roomNode.playerLeft.y = curspos - client.data.roomNode.playerLeft.h / 2;
        }
        else if (client.data.pos === 'right') {
            client.data.roomNode.playerRight.y = curspos - client.data.roomNode.playerRight.h / 2;
        }
    }
    decline(client, room) {
        client.data.pos = '';
        client.data.room = room;
        if (this.oneVoneLogic.rooms.find(Number(client.data.room))) {
            this.server.to(client.data.room).emit('leaveRoom');
        }
        console.log(room);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], oneVoneGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('setRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], oneVoneGateway.prototype, "setRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('clientType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], oneVoneGateway.prototype, "clientType", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updatePos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], oneVoneGateway.prototype, "updatePos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('decline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], oneVoneGateway.prototype, "decline", null);
oneVoneGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'onevone',
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
        game_1v1_logic_1.oneVoneLogic])
], oneVoneGateway);
exports.oneVoneGateway = oneVoneGateway;
//# sourceMappingURL=game.1v1.gateway.js.map