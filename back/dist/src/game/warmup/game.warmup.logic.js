"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarmUpLogic = exports.ClientNode = void 0;
const common_1 = require("@nestjs/common");
const game_interface_1 = require("../game.interface");
let ClientNode = class ClientNode {
};
ClientNode = __decorate([
    (0, common_1.Injectable)()
], ClientNode);
exports.ClientNode = ClientNode;
let WarmUpLogic = class WarmUpLogic {
    constructor() {
        this.canvasW = 800;
        this.canvasH = this.canvasW * 0.7;
        this.playerLeft = new game_interface_1.Player();
        this.playerRight = new game_interface_1.Player();
        this.ball = new game_interface_1.Ball();
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
            velocityX: 5,
            velocityY: 5,
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
        clientData.ball.x = this.canvasW / 2;
        clientData.ball.y = this.canvasH / 2;
        clientData.ball.velocityX *= -1;
    }
    update(clientData) {
        clientData.ball.x += clientData.ball.velocityX;
        clientData.ball.y += clientData.ball.velocityY;
        if (clientData.ball.x > this.canvasW / 2)
            clientData.playerRight.y = clientData.ball.y - clientData.playerRight.h / 2;
        if (clientData.ball.y + clientData.ball.r > this.canvasH || clientData.ball.y - clientData.ball.r < 0) {
            clientData.ball.velocityY *= -1;
        }
        let player = (clientData.ball.x < this.canvasW / 2) ? clientData.playerLeft : clientData.playerRight;
        if (this.collision(clientData.ball, player)) {
            clientData.ball.velocityX *= -1;
        }
        if (clientData.ball.x - clientData.ball.r < 0) {
            clientData.playerRight.score++;
            this.resetBall(clientData);
        }
        else if (clientData.ball.x + clientData.ball.r > this.canvasW) {
            clientData.playerLeft.score++;
            this.resetBall(clientData);
        }
    }
    startTime(clientData) {
        let start = Date.now();
        clientData.interval = setInterval(() => {
            let delta = Date.now() - start;
            clientData.timer = Math.floor(delta / 1000);
            this.update(clientData);
            console.log(clientData.timer);
        }, 1000);
    }
};
WarmUpLogic = __decorate([
    (0, common_1.Injectable)()
], WarmUpLogic);
exports.WarmUpLogic = WarmUpLogic;
//# sourceMappingURL=game.warmup.logic.js.map