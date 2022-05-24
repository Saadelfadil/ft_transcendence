"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneVoneLogic = void 0;
const common_1 = require("@nestjs/common");
const avl_1 = require("avl");
const game_interface_1 = require("../game.interface");
let oneVoneLogic = class oneVoneLogic {
    constructor() {
        this.rooms = new avl_1.default((a, b) => a - b, true);
        this.wRooms = new avl_1.default((a, b) => a - b, true);
        this.canvasW = 800;
        this.canvasH = this.canvasW * 0.7;
        this.playerLeft = new game_interface_1.Player();
        this.playerRight = new game_interface_1.Player();
        this.ball = new game_interface_1.Ball();
        this.time = 60;
    }
    initGmae() {
        let playerLeft = new game_interface_1.Player();
        let playerRight = new game_interface_1.Player();
        let ball = new game_interface_1.Ball();
        playerLeft = {
            x: 0,
            y: this.canvasH / 2 - 100 / 2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        playerRight = {
            x: this.canvasW - 10,
            y: this.canvasH / 2 - 100 / 2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        ball = {
            x: this.canvasW / 2,
            y: this.canvasH / 2,
            r: 10,
            speed: 5,
            velocityX: 1,
            velocityY: 1,
            color: "RED",
        };
        this.playerLeft = playerLeft;
        this.playerRight = playerRight;
        this.ball = ball;
    }
    collision(ball, player) {
        ball.top = ball.y - ball.r;
        ball.bottom = ball.y + ball.r;
        ball.left = ball.x - ball.r;
        ball.right = ball.x + ball.r;
        player.top = player.y;
        player.bottom = player.y + player.h;
        player.left = player.x;
        player.right = player.x + player.w;
        return ball.right > player.left && ball.bottom > player.top && ball.left < player.right && ball.top < player.bottom;
    }
    resetBall(clientData) {
        clientData.node.ball.x = this.canvasW / 2;
        clientData.node.ball.y = this.canvasH / 2;
        clientData.node.ball.velocityX *= -1;
    }
    update(clientData) {
        clientData.node = clientData.roomNode;
        clientData.node.ball.x += clientData.node.ball.velocityX * clientData.node.ball.speed;
        clientData.node.ball.y += clientData.node.ball.velocityY * clientData.node.ball.speed;
        if (clientData.node.ball.y + clientData.node.ball.r > this.canvasH || clientData.node.ball.y - clientData.node.ball.r < 0) {
            clientData.node.ball.velocityY *= -1;
        }
        let player = (clientData.node.ball.x < this.canvasW / 2) ? clientData.node.playerLeft : clientData.node.playerRight;
        if (this.collision(clientData.node.ball, player)) {
            clientData.node.ball.velocityX *= -1;
        }
        if (clientData.node.ball.x - clientData.node.ball.r < 0) {
            clientData.node.playerRight.score++;
            this.resetBall(clientData);
        }
        else if (clientData.node.ball.x + clientData.node.ball.r > this.canvasW) {
            clientData.node.playerLeft.score++;
            this.resetBall(clientData);
        }
    }
    addRoom(client) {
        this.initGmae();
        let roomnode = new game_interface_1.roomNode();
        roomnode.playerLeft = this.playerLeft;
        roomnode.playerRight = this.playerRight;
        roomnode.ball = this.ball;
        let node = this.rooms.insert(Number(client.data.room), roomnode);
        node.data.id = node.key.toString();
        client.join(node.data.id);
        node.data.players.push(client.data.userId);
        node.data.size = 1;
        return node.data;
    }
};
oneVoneLogic = __decorate([
    (0, common_1.Injectable)()
], oneVoneLogic);
exports.oneVoneLogic = oneVoneLogic;
//# sourceMappingURL=game.1v1.logic.js.map