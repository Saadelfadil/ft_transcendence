import AVLTree from 'avl';
import { Ball, Player, roomNode } from './game.interface';
export declare class ClientNode {
    id: string;
    timer: number;
    interval: number;
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
}
export declare class GameLogic {
    clientsTree: any;
    canvasH: number;
    canvasW: number;
    wclients: AVLTree<number, string>;
    rooms: AVLTree<number, roomNode>;
    wRooms: AVLTree<number, roomNode>;
    initGmae(CanvasH: number, CanvasW: number): any;
    collision(ball: any, player: any): boolean;
    resetBall(clientData: any): void;
    update(clientData: any): void;
    addClient(sockId: string): any;
    createNewRoom(client: any): {
        state: boolean;
        players: string[];
    };
    startTime(clientData: any): void;
    stopTime(clientData: any): void;
}
