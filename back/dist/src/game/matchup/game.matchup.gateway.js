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
exports.MatchUpGateway = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_entity_1 = require("../../users/user.entity");
const typeorm_2 = require("typeorm");
const game_interface_1 = require("../game.interface");
const game_repository_1 = require("../game.repository");
const game_matchup_logic_1 = require("./game.matchup.logic");
let MatchUpGateway = class MatchUpGateway {
    constructor(gameRepository, matchRepository, userRepository, matchUpLogic) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.matchUpLogic = matchUpLogic;
        this.logger = new common_1.Logger('GameGateway');
    }
    afterInit(server) {
        this.logger.log(`server io initiatted ${server}`);
    }
    handleDisconnect(client) {
        console.log('-----disconnect socket ------');
        console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
        this.clear(client);
        console.log(`wRooms: ${this.matchUpLogic.wRooms.size}`);
        console.log(`Rooms: ${this.matchUpLogic.rooms.size}`);
        console.log('-----end of disconnect socket ------\n');
    }
    checkRoomconnection(client) {
        let room = this.matchUpLogic.joinRoom(client);
        if (room) {
            let timer = 5;
            this.server.to(room.id).emit('connectedToRoom', timer, room.players);
            setTimeout(() => {
                this.server.to(room.id).emit('roomCreated', room.id, room.players);
                let newDbRoom = {};
                newDbRoom.name = room.id;
                newDbRoom.players = room.players;
                newDbRoom.namespace = 'matchup';
                this.gameRepository.addRoom(newDbRoom);
            }, timer * 1000);
        }
        else {
            client.emit('waitingForRoom', client.data.pos);
        }
    }
    handleConnection(client, ...args) {
        console.log('-----connect socket (matchup)------');
        console.log(`connect: ${client.id}`);
        console.log('-----end of connect socket ------\n');
    }
    initGame(client) {
        this.matchUpLogic.initGmae();
        client.data.node.playerLeft = this.matchUpLogic.playerLeft;
        client.data.node.playerRight = this.matchUpLogic.playerRight;
        client.data.node.ball = this.matchUpLogic.ball;
        console.log(client.data.node);
        client.emit("initData", {
            pl: client.data.node.playerLeft,
            pr: client.data.node.playerRight,
            b: client.data.node.ball,
            scw: this.matchUpLogic.canvasW,
            sch: this.matchUpLogic.canvasH,
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
        let node = this.matchUpLogic.rooms.find(Number(client.data.room));
        if (node) {
            client.data.roomStatus = 'play';
            client.data.node = node.data;
            console.log(client.data.node);
            client.emit('startMouseEvent');
            console.log('mouse event sended');
            if (client.data.pos === 'left')
                this.startGame(client);
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
            client.join(data.room);
            client.emit('canvasWH', { scw: this.matchUpLogic.canvasW, sch: this.matchUpLogic.canvasH });
        }
    }
    clear(client) {
        if (client.data.type === 'stream') {
            client.leave(client.data.room);
        }
        else {
            if (client.data.roomStatus === 'waiting') {
                client.leave(client.data.room);
                this.userRepository.update(client.data.userId, { in_game: false });
                this.matchUpLogic.wRooms.remove(Number(client.data.room));
            }
            else if (client.data.roomStatus === 'play') {
                client.leave(client.data.room);
                this.server.to(client.data.room).emit('leaveRoom');
                clearInterval(client.data.node.gameLoop);
                if (client.data.pos === 'left') {
                    this.matchRepository.addMatchData(client.data.node, 'matchup');
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
                this.matchUpLogic.rooms.remove(Number(client.data.room));
                this.gameRepository.deleteRoom(client.data.room);
            }
        }
    }
    startGame(client) {
        client.data.node.gameLoop = setInterval(() => {
            this.matchUpLogic.update(client.data);
            this.server.to(client.data.room).emit("updateClient", {
                pl: client.data.node.playerLeft,
                pr: client.data.node.playerRight,
                b: client.data.node.ball,
            });
        }, 1000 / 64);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MatchUpGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('initGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchUpGateway.prototype, "initGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updatePos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], MatchUpGateway.prototype, "updatePos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('setRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MatchUpGateway.prototype, "setRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('clientType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MatchUpGateway.prototype, "clientType", null);
MatchUpGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'matchup',
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
        game_matchup_logic_1.MatchUpLogic])
], MatchUpGateway);
exports.MatchUpGateway = MatchUpGateway;
//# sourceMappingURL=game.matchup.gateway.js.map