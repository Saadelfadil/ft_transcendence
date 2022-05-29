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
exports.GameGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameGateway = class GameGateway {
    constructor() {
        this.logger = new common_1.Logger('GameGateway');
    }
    afterInit(server) {
        this.logger.log(`server io initiatted ${server}`);
    }
    handleDisconnect(client) {
        //console.log('-----disconnect socket ------');
        //console.log(`disconnect: ${client.id}`);
        //console.log('-----end of disconnect socket ------\n');
    }
    handleConnection(client, ...args) {
        //console.log('-----connect socket (game)------');
        //console.log(`heereconnect: ${client.id}`);
        this.server.on('clientType', (type) => {
            if (type === 'stream') {
                //console.log(type);
            }
        });
        //console.log('-----end of connect socket ------\n');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'game',
        cors: {
            origin: '*',
        }
    })
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map