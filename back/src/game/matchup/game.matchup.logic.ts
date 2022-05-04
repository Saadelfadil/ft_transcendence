import { Injectable } from '@nestjs/common';
import AVLTree from 'avl';
import { Socket } from 'socket.io';
import { Ball, Player, roomNode } from '../game.interface';

@Injectable()
export class MatchUpLogic {

    rooms: AVLTree<number, roomNode> = new AVLTree((a, b) => a - b, true);
    wRooms: AVLTree<number, roomNode> = new AVLTree((a, b) => a - b, true);
    canvasH: number;
    canvasW: number;

    initGmae(CanvasH: number, CanvasW: number): any{
        let playerLeft = new Player();
        let playerRight = new Player();
        let ball: Ball;

        this.canvasH = CanvasH;
        this.canvasW = CanvasW;
        // console.log(`canvash: ${CanvasH}`);
        // console.log(`canvasw: ${CanvasW}`);
        playerLeft = {
            x: 0,
            y: CanvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        playerRight = {
            x: CanvasW - 10,
            y: CanvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: '',
        };
        ball = {
            x: CanvasW/2,
            y: CanvasH/2,
            r: 10,
            speed: 5,
            velocityX: 1,
            velocityY: 1,
            color: "RED",
        };
        return {playerLeft, playerRight, ball}
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
        
        clientData.node.ball.x += clientData.node.ball.velocityX * clientData.node.ball.speed;
        clientData.node.ball.y += clientData.node.ball.velocityY * clientData.node.ball.speed;

        // if (clientData.ball.x > this.canvasW/2)
        //     clientData.node.playerRight.y = clientData.ball.y - clientData.node.playerRight.h/2; 

        if(clientData.node.ball.y + clientData.node.ball.r > this.canvasH || clientData.node.ball.y - clientData.node.ball.r < 0){
            clientData.node.ball.velocityY *= -1;
        }

        let player = (clientData.node.ball.x < this.canvasW/2) ? clientData.node.playerLeft : clientData.node.playerRight;
        //console.log(player.y);
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

    joinRoom(client: Socket) :roomNode{
        let roomnode = new roomNode();
        if (this.wRooms.size > 0){
            let node = this.wRooms.minNode();
            let newNode = this.rooms.insert(node.key, node.data);
            this.wRooms.remove(node.key);
            client.join(newNode.data.id);
            newNode.data.players.push(client.data.userId);
            newNode.data.size++;
            client.data.pos = 'right';
            client.data.room = newNode.data.id;
            client.data.roomStatus = 'play';
            return newNode.data;
        } else {
            let node = this.wRooms.insert(Date.now(), roomnode);
            while(node === null)
                node = this.wRooms.insert(Date.now(), roomnode);
            node.data.id = node.key.toString();
            client.join(node.data.id);
            node.data.players.push(client.data.userId);
            node.data.size = 1;
            client.data.pos = 'left'; 
            client.data.room = node.data.id;
            return null;
        }
    }

}