import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection,
          OnGatewayDisconnect,
          OnGatewayInit,
          SubscribeMessage,
          WebSocketGateway,
          WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { roomDb, roomNode } from '../game.interface';
import { GameRepository, MatchRepository } from '../game.repository';
import { WarmUpLogic } from './game.warmup.logic';

@WebSocketGateway({
  namespace: 'warmup',
  cors: {
    origin: '*',
  }
})
export class WarmUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    @InjectRepository(MatchRepository) private matchRepository: MatchRepository,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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
      let matchData = new roomNode();
      matchData.id = client.data.id;
      matchData.playerLeft = client.data.playerLeft;
      matchData.playerRight = client.data.playerRight;
      matchData.players = [client.data.userId, '0'];
      this.userRepository.update(client.data.userId, {in_game: false});
      this.matchRepository.addMatchData(matchData, 'warmup');
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
      client.emit('canvasWH', {scw: this.warmUp.canvasW, sch: this.warmUp.canvasH});
    }
  }

  @SubscribeMessage('initGame')
  initGame(client: any, clientData: any): void {
    //let initData : {};
    client.data.userId = clientData.userId;
    this.userRepository.update(client.data.userId, {in_game: true});
    //console.log(`init: ${clientData.canvasW}, ${clientData.canvasH}`);
    //client.data.playerLeft = this.warmUp.
    this.warmUp.initGmae();
    client.data.playerLeft = this.warmUp.playerLeft;
    client.data.playerRight = this.warmUp.playerRight;
    client.data.ball = this.warmUp.ball;
    //console.log(client.data);
    client.emit("initData", {
      pl: client.data.playerLeft,
      pr: client.data.playerRight,
      b: client.data.ball,
      scw: this.warmUp.canvasW,
      sch: this.warmUp.canvasH,
    });
    console.log('done init gme')
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
    newDbRoom.players = [client.data.userId, '0'];
    newDbRoom.namespace = 'warmup';
    this.gameRepository.addRoom(newDbRoom);
    client.data.gameLoop = setInterval(() => {
        this.warmUp.update(client.data);
        this.server.to(client.id).emit("updateClient", {
          pl: client.data.playerLeft,
          pr: client.data.playerRight,
          b: client.data.ball,
          scw: this.warmUp.canvasW,
          sch: this.warmUp.canvasH,
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
  updatePos(client: any, curspos: number): void {
    client.data.playerLeft.y = curspos - client.data.playerLeft.h/2;
  }
}
