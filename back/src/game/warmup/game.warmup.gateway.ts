import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection,
          OnGatewayDisconnect,
          OnGatewayInit,
          SubscribeMessage,
          WebSocketGateway,
          WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { roomDb } from '../game.interface';
import { GameRepository } from '../game.repository';
import { WarmUpLogic } from './game.warmup.logic';

@WebSocketGateway({
  namespace: 'warmup',
  cors: {
    origin: '*',
  }
})
export class WarmUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRepository(GameRepository)
    private gameRepository: GameRepository,
    private warmUp: WarmUpLogic
  ){}

  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('WarmUp');
  afterInit(server: Server){
    this.logger.log(`server io initiatted ${server}`);
  }

  handleDisconnect(client: Socket) {
    console.log('-----disconnect socket ------');
    console.log(`disconnect: ${client.id}`);
    if (client.data.type === 'stream'){
      client.leave(client.data.room);
    } else {
      this.stopTime(client);
      this.stopGame(client);
      this.gameRepository.deleteRoom(client.id);
    }
    console.log('-----end of disconnect socket ------\n');
    //this.warmUp.wclients.find(client.id)
    //this.warmUp.rmClient(client.id);
    //this.logger.log(`client disconnected ${client}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('-----connect socket (warmap) ------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
    //client.data = this.warmUp.addClient(client.id); --> warmup logic
  }


  @SubscribeMessage('clientType')
  clientType(client: any, data: any): void {
    client.data.type = data.type;
    if (data.type === 'stream'){
      console.log(data.room);
      client.data.room = data.room;
      client.join(data.room);
    }
  }

  @SubscribeMessage('initGame')
  initGame(client: any, canvas: any): void {
    //let initData : {};
    console.log(`init: ${canvas.canvasW}, ${canvas.canvasH}`);
    //client.data.playerLeft = this.warmUp.
    let {...data} = this.warmUp.initGmae(canvas.canvasH, canvas.canvasW);
    client.data.playerLeft = data.playerLeft;
    client.data.playerRight = data.playerRight;
    client.data.ball = data.ball;
    //console.log(client.data);
    client.emit("updateClient", {
      pl: data.playerLeft,
      pr: data.playerRight,
      b: data.ball
    });
  }

  @SubscribeMessage('startTime')
  startTime(client: any){
    let start = Date.now();
    client.data.interval = setInterval(() => {
        let delta = Date.now() - start;
        client.data.timer = Math.floor(delta / 1000);
        client.emit("updateTime", client.data.timer);
        console.log(client.data.timer);
    }, 1000);
  }

  @SubscribeMessage('startGame')
  startGame(client: any){
    let newDbRoom = {} as roomDb;
    newDbRoom.name = client.id;
    newDbRoom.players = [client.id, 'AI'];
    newDbRoom.namespace = 'warmup';
    this.gameRepository.addRoom(newDbRoom);
    client.data.gameLoop = setInterval(() => {
        this.warmUp.update(client.data);
        this.server.to(client.id).emit("updateClient", {
          pl: client.data.playerLeft,
          pr: client.data.playerRight,
          b: client.data.ball,
        });
    }, 1000/65);
  }

  @SubscribeMessage('stopGame')
  stopGame(client: any){
    clearInterval(client.data.gameLoop);
  }

  @SubscribeMessage('stopTime')
  stopTime(client: any){
    clearInterval(client.data.interval);
  }

  @SubscribeMessage('updatePos')
  updatePos(client: any, playerLeft: any): void {
    if (playerLeft){
      client.data.playerLeft = playerLeft;
    }
  }
}
