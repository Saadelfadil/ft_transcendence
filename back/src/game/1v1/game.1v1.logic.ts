import { Injectable } from '@nestjs/common';
import AVLTree from 'avl';
import { Socket } from 'socket.io';
import { Ball, Player, roomNode } from '../game.interface';

@Injectable()
export class oneVoneLogic {

    rooms: AVLTree<number, roomNode> = new AVLTree((a , b) => a - b, true);
    wRooms: AVLTree<number, roomNode> = new AVLTree((a, b) => a - b, true);
    canvasW: number = 800;
    canvasH: number = this.canvasW * 0.7;
    playerLeft = new Player();
    playerRight = new Player();
    ball = new Ball();
    time: number = 60;

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
        clientData.node.ball.x = this.canvasW/2;
        clientData.node.ball.y = this.canvasH/2;
        clientData.node.ball.velocityX *= -1;
    }

    update(clientData: any){
        clientData.node = clientData.roomNode;
        clientData.node.ball.x += clientData.node.ball.velocityX * clientData.node.ball.speed;
        clientData.node.ball.y += clientData.node.ball.velocityY * clientData.node.ball.speed;
        
        if(clientData.node.ball.y + clientData.node.ball.r > this.canvasH || clientData.node.ball.y - clientData.node.ball.r < 0){
            clientData.node.ball.velocityY *= -1;
        }

        let player = (clientData.node.ball.x < this.canvasW/2) ? clientData.node.playerLeft : clientData.node.playerRight;
        if (this.collision(clientData.node.ball, player)){
            clientData.node.ball.velocityX *= -1;
        }

        if (clientData.node.ball.x - clientData.node.ball.r < 0){
            clientData.node.playerRight.score++;
            this.resetBall(clientData);
        } else if (clientData.node.ball.x + clientData.node.ball.r > this.canvasW){
            clientData.node.playerLeft.score++;
            this.resetBall(clientData);
        }
    }

    addRoom(client: Socket): roomNode{
        this.initGmae()
        let roomnode = new roomNode();
        roomnode.playerLeft = this.playerLeft;
        roomnode.playerRight = this.playerRight;
        roomnode.ball = this.ball;
        // if (this.wRooms.size > 0){
        //     let node = this.wRooms.minNode();
        //     let newNode = this.rooms.insert(node.key, node.data);
        //     this.wRooms.remove(node.key);
        //     client.join(newNode.data.id);
        // } else {
            let node = this.rooms.insert(Number(client.data.room), roomnode);

            node.data.id = node.key.toString();
            client.join(node.data.id);
            node.data.players.push(client.data.userId);
            node.data.size = 1;
        //}
        return node.data;
    }

}