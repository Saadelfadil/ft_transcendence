import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection,
          OnGatewayDisconnect,
          OnGatewayInit,
          SubscribeMessage,
          WebSocketGateway,
          WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/user.entity';
import { Repository } from 'typeorm';
import { Match, matchPlayerData } from '../game.entities';
import { roomDb, roomNode } from '../game.interface';
import { GameRepository, MatchRepository } from '../game.repository';
import { GameService } from '../game.service';
import { LevelUpLogic } from './game.levelup.logic';

@WebSocketGateway({
  namespace: 'levelup',
  cors: {
    origin: '*',
  }
})
export class LevelUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    @InjectRepository(MatchRepository) private matchRepository: MatchRepository,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private levelUpLogic: LevelUpLogic,
  ){}

  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('GameGateway');
  afterInit(server: Server){
    this.logger.log(`server io initiatted ${server}`);
  }

  handleDisconnect(client: Socket) {
    console.log('-----disconnect socket ------');
    console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
    this.clear(client);
    console.log(`wRooms: ${this.levelUpLogic.wRooms.size}`);
    console.log(`Rooms: ${this.levelUpLogic.rooms.size}`);
    console.log('-----end of disconnect socket ------\n');
    //this.levelUpLogic.wclients.find(client.id)
    //this.levelUpLogic.rmClient(client.id);
    //this.logger.log(`client disconnected ${client}`);
  }

  checkRoomconnection(client: Socket){
    let room = this.levelUpLogic.joinRoom(client);
    if (room){
      //client.data.room = room;
      //console.log(client.data.node);
      let timer: number = 5;
      this.server.to(room.id).emit('connectedToRoom', timer, room.players);
      setTimeout(() => {
        this.server.to(room.id).emit('roomCreated', room.id, room.players);
        let newDbRoom = {} as roomDb;
        newDbRoom.name = room.id;
        newDbRoom.players = room.players;
        newDbRoom.namespace = 'levelup';
        this.gameRepository.addRoom(newDbRoom);
        //this.gameRepository.getAllRooms();
      }, timer * 1000);
    } else {
      client.emit('waitingForRoom', client.data.pos);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.gameService.rooms.push(client.id);
    console.log('-----connect socket (levelup)------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
    //client.data = this.levelUpLogic.addClient(client.id); --> warmup logic
  }

  @SubscribeMessage('initGame')
  initGame(client: any): void {
    //let initData : {};
    //console.log(`init: ${canvas.canvasW}, ${canvas.canvasH}`);
    //client.data.playerLeft = this.gameLogic.
    this.levelUpLogic.initGmae();
    client.data.node.playerLeft = this.levelUpLogic.playerLeft;
    client.data.node.playerRight = this.levelUpLogic.playerRight;
    client.data.node.ball = this.levelUpLogic.ball;
    // client.data.node.playerLeft = data.playerLeft;
    // client.data.node.playerRight = data.playerRight;
    // client.data.node.ball = data.ball;
    //client.data.node.canvasW = data.canvasW;
    console.log(client.data.node);
    client.emit("initData", {
      pl: client.data.node.playerLeft,
      pr: client.data.node.playerRight,
      b: client.data.node.ball,
      scw: this.levelUpLogic.canvasW,
      sch: this.levelUpLogic.canvasH,
    });
    //if (client.data.pos === 'left')
      //this.startGame(client);
    //console.log('here');
  }

  @SubscribeMessage('updatePos')
  updatePos(client: any, curspos: number): void {
    if (client.data.pos === 'left'){
      client.data.node.playerLeft.y = curspos - client.data.node.playerLeft.h/2;
    } else if (client.data.pos === 'right') {
      client.data.node.playerRight.y = curspos - client.data.node.playerRight.h/2;
    }
  }

  @SubscribeMessage('setRoom')
  setRoom(client: any, room: string): void {
    client.data.room = room;
    let node = this.levelUpLogic.rooms.find(Number(client.data.room));
    if (node){
      client.data.roomStatus = 'play';
      client.data.node = node.data;
      console.log(client.data.node);
      client.emit('startMouseEvent');
      console.log('mouse event sended');
      if (client.data.pos === 'left')
        this.startGame(client);
    }
  }

  @SubscribeMessage('clientType')
  clientType(client: any, data: any): void {
    client.data.userId = data.userId;
    //console.log(client.data.userId);
    client.data.type = data.type;
    if (data.type === 'play'){
      this.userRepository.update(client.data.userId, {in_game: true});
      client.data.node = new roomNode();
      client.data.room = '';
      client.data.roomStatus = 'waiting';
      this.initGame(client);
      this.checkRoomconnection(client);

      // console.log(`wRooms: ${this.levelUpLogic.wRooms.size}`);
      // this.levelUpLogic.wRooms.values().forEach(element => {
      //   console.log(element);
      // });
      // console.log(`Rooms: ${this.levelUpLogic.rooms.size}`);
      // this.levelUpLogic.rooms.values().forEach(element => {
      //   console.log(element);
      // });

    } else if (data.type === 'stream'){
      console.log(data.room, 'stream');
      client.data.room = data.room;
      client.join(data.room);
      client.emit('canvasWH', {scw: this.levelUpLogic.canvasW, sch: this.levelUpLogic.canvasH});
    }
  }

  clear(client: any){
    if (client.data.type === 'stream'){
      client.leave(client.data.room);
      //client.emit('leaveRoom');
    } else {
      if (client.data.roomStatus === 'waiting'){
        client.leave(client.data.room);
        this.userRepository.update(client.data.userId, {in_game: false});
        this.levelUpLogic.wRooms.remove(Number(client.data.room));
      } else if (client.data.roomStatus === 'play'){
        client.leave(client.data.room);
        this.server.to(client.data.room).emit('leaveRoom');
        clearInterval(client.data.node.gameLoop);
        clearInterval(client.data.node.gameTimer);
        if (client.data.pos === 'left'){
          this.matchRepository.addMatchData(client.data.node, 'levelup');
          if (client.data.node.playerLeft.score > client.data.node.playerRight.score){
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 3",
                                  wins: () => "wins + 1"
                                }).where("id = :id", { id: client.data.node.players[0]}).execute();
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  loss: () => "loss + 1"
                                }).where("id = :id", { id: client.data.node.players[1]}).execute();
          } else if (client.data.node.playerLeft.score < client.data.node.playerRight.score) {
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 3",
                                  wins: () => "wins + 1"
                                }).where("id = :id", { id: client.data.node.players[1]}).execute();
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  loss: () => "loss + 1"
                                }).where("id = :id", { id: client.data.node.players[0]}).execute();
          } else {
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 1"
                                }).where("id = :id0 AND id = :id1", { id0: client.data.node.players[0], id1: client.data.node.players[1]}).execute();
          }
          this.userRepository.update(Number(client.data.node.players[0]), {in_game: false});
          this.userRepository.update(Number(client.data.node.players[1]), {in_game: false});
        }
        //console.log(client.data.node);
        this.levelUpLogic.rooms.remove(Number(client.data.room));
        this.gameRepository.deleteRoom(client.data.room);
      }
    }
  }

  startGame(client: any){
    this.startTime(client);
    client.data.node.gameLoop = setInterval(() => {
        this.levelUpLogic.update(client.data);
        this.server.to(client.data.room).emit("updateClient", {
          pl: client.data.node.playerLeft,
          pr: client.data.node.playerRight,
          b: client.data.node.ball,
        });
    }, 1000/64);
  }

  
  startTime(client: any){
    let start = Date.now();
    client.data.node.gameTimer = setInterval(() => {
        let delta = Date.now() - start;
        let timer = Math.floor(delta / 1000);
        client.data.node.time = timer;
        if (client.data.node.time % 5 === 0){
          console.log("levelup");
          client.data.node.ball.speed += 0.25;
          client.data.node.playerLeft.h -= 2.5;
          client.data.node.playerRight.h -= 2.5;
        }
        this.server.to(client.data.room).emit("updateTime", client.data.node.time);
        console.log(timer);
    }, 1000);
  }
}
