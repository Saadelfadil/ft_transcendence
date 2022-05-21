"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomNode = exports.Ball = exports.Player = void 0;
class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.color = '';
        this.score = 0;
        this.name = '';
    }
}
exports.Player = Player;
class Ball {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.speed = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.color = '';
    }
}
exports.Ball = Ball;
class roomNode {
    constructor() {
        this.id = '';
        this.size = 0;
        this.players = [];
        this.playerLeft = new Player();
        this.playerRight = new Player();
        this.ball = new Ball();
        this.time = 0;
    }
}
exports.roomNode = roomNode;
//# sourceMappingURL=game.interface.js.map