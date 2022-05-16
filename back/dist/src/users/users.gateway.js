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
let OnlineGateway = class OnlineGateway {
    constructor() {
        this.onlineUsers = {};
    }
    handleOnlineUsers(client, payload) {
        this.onlineUsers[client.id] = payload.data.userId;
        client.broadcast.emit('onlineUsers', this.onlineUsers);
        return { onlineUsers: this.onlineUsers };
    }
    handleDisconnect(client, ...args) {
        delete this.onlineUsers[client.id];
        client.broadcast.emit('onlineUsers', this.onlineUsers);
    }
    handleConnection(client, ...args) {
        client.broadcast.emit('onlineUsers', this.onlineUsers);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('online'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], OnlineGateway.prototype, "handleOnlineUsers", null);
OnlineGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8009, { cors: true }),
    __metadata("design:paramtypes", [])
], OnlineGateway);
exports.OnlineGateway = OnlineGateway;
//# sourceMappingURL=users.gateway.js.map