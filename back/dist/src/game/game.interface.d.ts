export declare class Player {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    score: number;
    name: string;
}
export declare class Ball {
    x: number;
    y: number;
    r: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: string;
}
export interface IClientNode {
    timer: number;
    interval: number;
}
export declare class roomNode {
    id: string;
    size: number;
    players: string[];
    playerLeft: Player;
    playerRight: Player;
    ball: Ball;
    gameLoop: any;
    gameTimer: any;
    time: number;
}
export interface roomDb {
    name: string;
    players: string[];
    namespace: string;
}
