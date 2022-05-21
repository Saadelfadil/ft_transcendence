import { Injectable } from '@nestjs/common';
import AVLTree from 'avl';
import { stat } from 'fs';
import { Ball, IClientNode, Player, roomNode } from './game.interface';

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
export class GameLogic {

    clientsTree: any = new AVLTree((a:any, b:any) => a - b, true);
    canvasH: number;
    canvasW: number;
    wclients: AVLTree<number, string> = new AVLTree((a, b) => a - b, true);
    rooms: AVLTree<number, roomNode> = new AVLTree((a, b) => a - b, true);
    wRooms: AVLTree<number, roomNode> = new AVLTree((a, b) => a - b, true);
    
    initGmae(CanvasH: number, CanvasW: number): any{
        let playerLeft: Player;
        let playerRight: Player;
        let ball: Ball;

        this.canvasH = CanvasH;
        this.canvasW = CanvasW;
        console.log(`canvash: ${CanvasH}`);
        console.log(`canvasw: ${CanvasW}`);
        playerLeft = {
            x: 0,
            y: CanvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: ''
        };
        playerRight = {
            x: CanvasW - 10,
            y: CanvasH/2 - 100/2,
            w: 10,
            h: 100,
            color: "WHITE",
            score: 0,
            name: ''
        };
        ball = {
            x: CanvasW/2,
            y: CanvasH/2,
            r: 10,
            speed: 5,
            velocityX: 5,
            velocityY: 5,
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
        clientData.ball.x = this.canvasW/2;
        clientData.ball.y = this.canvasH/2;
        clientData.ball.velocityX *= -1;
    }

    update(clientData: any){
        clientData.ball.x += clientData.ball.velocityX;
        clientData.ball.y += clientData.ball.velocityY;

        if (clientData.ball.x > this.canvasW/2)
            clientData.playerRight.y = clientData.ball.y - clientData.playerRight.h/2; 

        if(clientData.ball.y + clientData.ball.r > this.canvasH || clientData.ball.y - clientData.ball.r < 0){
            clientData.ball.velocityY *= -1;
        }

        let player = (clientData.ball.x < this.canvasW/2) ? clientData.playerLeft : clientData.playerRight;
        if (this.collision(clientData.ball, player)){
            clientData.ball.velocityX *= -1;
        }

        if (clientData.ball.x - clientData.ball.r < 0){
            //userLeft.score++;
            this.resetBall(clientData);
        } else if (clientData.ball.x + clientData.ball.r > this.canvasW){
            //userRight.score++;
            this.resetBall(clientData);
        }
    }

    addClient(sockId: string): any{
        let newNode = new ClientNode();
        newNode.id = sockId;
        this.clientsTree.insert(sockId, newNode);
        return this.clientsTree.find(sockId).data;
    }

    createNewRoom(client: any): {state: boolean, players: string[]} {
        //console.log(client);
        let state = false;
        let players = [];
        if (this.wclients.size < 2){
            return {state , players};
        } else {
            this.wclients.remove(client.data.stamp);
            players.push(client.id);
            players.push(this.wclients.pop().data);
            state = true;
            //console.log(clientStamp);
            return {state , players};
        }
    }
    // addWclient(sockId: string): number{
    //     return this.wclients.push(sockId);
    // }
    // rmClient(sockId: string){

    // }

    // getClient(sockId: string): any{
    //     return this.clientsTree.find(sockId);
    // }

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

    stopTime(clientData: any){
        //let clientNodeData = this.getClient(sockId).data;
        clearInterval(clientData.interval);
    }

}