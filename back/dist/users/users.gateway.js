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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let OnlineGateway = class OnlineGateway {
    constructor() {
        this.onlineUsers = {};
        this.inGameUsers = [];
        this.logger = new common_1.Logger('MessageGateway');
    }
    handleOnlineUsers(client, payload) {
        this.onlineUsers[client.id] = payload.data.userId;
        this.server.emit('online-users', this.onlineUsers);
        return { onlineUsers: this.onlineUsers };
    }
    InGameUsers(client, payload) {
        //console.log(`in game players ${this.inGameUsers}`);
        if (payload.playing) {
            this.inGameUsers.push(payload.user_id);
            this.server.emit('all-users-in-game', this.inGameUsers);
        }
        else {
            this.inGameUsers.map((id, index) => {
                if (id === payload.user_id) {
                    this.inGameUsers.splice(index, 1);
                    this.server.emit('all-users-in-game', this.inGameUsers);
                    return;
                }
            });
        }
    }
    afterInit(server) {
    }
    handleDisconnect(client) {
        delete this.onlineUsers[client.id];
        this.server.emit('online-users', this.onlineUsers);
    }
    handleConnection(client, ...args) {
        this.server.emit('online-users', this.onlineUsers);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OnlineGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('online'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], OnlineGateway.prototype, "handleOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('in-game-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnlineGateway.prototype, "InGameUsers", null);
OnlineGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'onlineUsers',
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [])
], OnlineGateway);
exports.OnlineGateway = OnlineGateway;
//# sourceMappingURL=users.gateway.js.map