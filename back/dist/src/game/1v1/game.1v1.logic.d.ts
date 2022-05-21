import AVLTree from 'avl';
import { Socket } from 'socket.io';
import { Ball, Player, roomNode } from '../game.interface';
export declare class oneVoneLogic {
    rooms: AVLTree<number, roomNode>;
    wRooms: AVLTree<number, roomNode>;
    canvasW: number;
    canvasH: number;
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
    initGmae(): void;
    collision(ball: any, player: any): boolean;
    resetBall(clientData: any): void;
    update(clientData: any): void;
    addRoom(client: Socket): roomNode;
}
