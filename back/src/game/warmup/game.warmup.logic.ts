import { Injectable } from '@nestjs/common';
import AVLTree from 'avl';
import { stat } from 'fs';
import { Ball, IClientNode, Player, roomNode } from '../game.interface';

@Injectable()
export class ClientNode {
    id: string;
    timer: number;
    interval: number;
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
}

@Injectable()
export class WarmUpLogic {

    canvasW: number = 800;
    canvasH: number = this.canvasW * 0.7;
    playerLeft = new Player();
    playerRight = new Player();
    ball = new Ball();

    initGmae(){
        let playerLeft = new Player();
        let playerRight = new Player();
        let ball = new Ball();

        playerLeft = {
            x: 0,
            y: this.canvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        playerRight = {
            x: this.canvasW - 10,
            y: this.canvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        ball = {
            x: this.canvasW/2,
            y: this.canvasH/2,
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

    collision(ball: any, player: any): boolean{
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

    resetBall(clientData: any){
        clientData.ball.x = this.canvasW/2;
        clientData.ball.y = this.canvasH/2;
        clientData.ball.velocityX *= -1;
    }

    update(clientData: any){
        if (clientData.ball.speed < 10)
            clientData.ball.speed += 0.001;
        clientData.ball.x += clientData.ball.velocityX * clientData.ball.speed;
        clientData.ball.y += clientData.ball.velocityY * clientData.ball.speed;

        if (clientData.ball.x > this.canvasW/2)
            clientData.playerRight.y = (clientData.ball.y - clientData.playerRight.h/2) + Math.floor(Math.random() * (10 + 1));; 

        if(clientData.ball.y + clientData.ball.r > this.canvasH || clientData.ball.y - clientData.ball.r < 0){
            clientData.ball.velocityY *= -1;
        }

        let player = (clientData.ball.x < this.canvasW/2) ? clientData.playerLeft : clientData.playerRight;
        if (this.collision(clientData.ball, player)){
            clientData.ball.velocityX *= -1;
        }

        if (clientData.ball.x - clientData.ball.r < 0){
            clientData.playerRight.score++;
            this.resetBall(clientData);
        } else if (clientData.ball.x + clientData.ball.r > this.canvasW){
            clientData.playerLeft.score++;
            this.resetBall(clientData);
        }
    }

    startTime(clientData: any){
        // let clientNodeData = this.getClient().data;
        let start = Date.now();
        clientData.interval = setInterval(() => {
            let delta = Date.now() - start;
            clientData.timer = Math.floor(delta / 1000);
            // console.log(clientData);
            this.update(clientData);
            console.log(clientData.timer);
        //client.emit("updateTime", Math.floor(delta / 1000))
        }, 1000);
    }

}