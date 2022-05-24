export class Player {
    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;
    color: string = '';
    score: number = 0;
    name: string = '';
}

export class Ball {
    x: number = 0;
    y: number = 0;
    r: number = 0;
    speed: number = 0;
    velocityX: number = 0;
    velocityY: number = 0;
    color: string = '';
}

export interface IClientNode {
    timer: number;
    interval: number;
}

export class roomNode{
    id: string = '';
    size: number = 0;
    players: string[] = [];
    playerLeft: Player = new Player();
    playerRight: Player = new Player();
    ball: Ball = new Ball();
    gameLoop: any;
    gameTimer: any;
    time: number = 0;
    first_logout: string = '';
}

export interface roomDb{
    name: string,
    players: string[],
    namespace: string,
}
