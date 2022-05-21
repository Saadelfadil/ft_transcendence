import { Ball, Player } from '../game.interface';
export declare class ClientNode {
    id: string;
    timer: number;
    interval: number;
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
}
export declare class WarmUpLogic {
    canvasW: number;
    canvasH: number;
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
    initGmae(): void;
    collision(ball: any, player: any): boolean;
    resetBall(clientData: any): void;
    update(clientData: any): void;
    startTime(clientData: any): void;
}
