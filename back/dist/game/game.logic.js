"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogic = exports.ClientNode = void 0;
const common_1 = require("@nestjs/common");
const avl_1 = require("avl");
let ClientNode = class ClientNode {
};
ClientNode = __decorate([
    (0, common_1.Injectable)()
], ClientNode);
exports.ClientNode = ClientNode;
let GameLogic = class GameLogic {
    constructor() {
        this.clientsTree = new avl_1.default((a, b) => a - b, true);
        this.wclients = new avl_1.default((a, b) => a - b, true);
        this.rooms = new avl_1.default((a, b) => a - b, true);
        this.wRooms = new avl_1.default((a, b) => a - b, true);
    }
    initGmae(CanvasH, CanvasW) {
        let playerLeft;
        let playerRight;
        let ball;
        this.canvasH = CanvasH;
        this.canvasW = CanvasW;
        //console.log(`canvash: ${CanvasH}`);
        //console.log(`canvasw: ${CanvasW}`);
        playerLeft = {
            x: 0,
            y: CanvasH / 2 - 100 / 2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: ''
        };
        playerRight = {
            x: CanvasW - 10,
            y: CanvasH / 2 - 100 / 2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: ''
        };
        ball = {
            x: CanvasW / 2,
            y: CanvasH / 2,
            r: 10,
            speed: 5,
            velocityX: 5,
            velocityY: 5,
            color: "RED",
        };
        return { playerLeft, playerRight, ball };
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
            this.resetBall(clientData);
        }
        else if (clientData.ball.x + clientData.ball.r > this.canvasW) {
            this.resetBall(clientData);
        }
    }
    addClient(sockId) {
        let newNode = new ClientNode();
        newNode.id = sockId;
        this.clientsTree.insert(sockId, newNode);
        return this.clientsTree.find(sockId).data;
    }
    createNewRoom(client) {
        let state = false;
        let players = [];
        if (this.wclients.size < 2) {
            return { state, players };
        }
        else {
            this.wclients.remove(client.data.stamp);
            players.push(client.id);
            players.push(this.wclients.pop().data);
            state = true;
            return { state, players };
        }
    }
    startTime(clientData) {
        let start = Date.now();
        clientData.interval = setInterval(() => {
            let delta = Date.now() - start;
            clientData.timer = Math.floor(delta / 1000);
            this.update(clientData);
            //console.log(clientData.timer);
        }, 1000);
    }
    stopTime(clientData) {
        clearInterval(clientData.interval);
    }
};
GameLogic = __decorate([
    (0, common_1.Injectable)()
], GameLogic);
exports.GameLogic = GameLogic;
//# sourceMappingURL=game.logic.js.map