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
import { threadId } from 'worker_threads';
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
    console.log('-----disconnect socket (levelup)------');
    console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
    if (client.data.node){
      if (client.data.node.time < this.levelUpLogic.time && client.data.node.first_logout === ''){
        client.data.node.first_logout =  client.data.pos;
        console.log('first: ', client.data.pos);
      }
    }
    this.clear(client);
    console.log(`wRooms: ${this.levelUpLogic.wRooms.size}`);
    console.log(`Rooms: ${this.levelUpLogic.rooms.size}`);
    console.log('-----end of disconnect socket ------\n');
  }

  checkRoomconnection(client: Socket){
    let room = this.levelUpLogic.joinRoom(client);
    if (room){
      let timer: number = 5;
      this.server.to(room.id).emit('connectedToRoom', timer, room.players);
      setTimeout(() => {
        this.server.to(room.id).emit('roomCreated', room.id, room.players);
      }, timer * 1000);
    } else {
      client.emit('waitingForRoom', client.data.pos);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('-----connect socket (levelup)------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
  }

  @SubscribeMessage('initGame')
  initGame(client: any): void {
  
    this.levelUpLogic.initGmae();
    client.data.node.playerLeft = this.levelUpLogic.playerLeft;
    client.data.node.playerRight = this.levelUpLogic.playerRight;
    client.data.node.ball = this.levelUpLogic.ball;
  
    console.log(client.data.node);
    client.emit("initData", {
      pl: client.data.node.playerLeft,
      pr: client.data.node.playerRight,
      b: client.data.node.ball,
      scw: this.levelUpLogic.canvasW,
      sch: this.levelUpLogic.canvasH,
    });
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
      if (client.data.pos === 'left'){
        let newDbRoom = {} as roomDb;
        newDbRoom.name = client.data.node.id;
        newDbRoom.players = client.data.node.players;
        newDbRoom.namespace = 'levelup';
        this.gameRepository.addRoom(newDbRoom);
        this.startGame(client);
      }
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
    } else if (data.type === 'stream'){
      console.log(data.room, 'stream');
      client.data.room = data.room;
      if (!this.levelUpLogic.rooms.find(Number(data.room))){
        console.log("no room");
        client.emit('noRoom');
        return;
      }
      client.join(data.room);
      client.emit('canvasWH', {scw: this.levelUpLogic.canvasW, sch: this.levelUpLogic.canvasH});
    }
  }

  clear(client: any){
    if (client.data.type === 'stream'){
      client.leave(client.data.room);
      client.emit('leaveRoom');
    } else {
      if (client.data.roomStatus === 'waiting'){
        this.server.to(client.data.room).emit('leaveRoom');
        this.userRepository.update(client.data.userId, {in_game: false});
        this.levelUpLogic.wRooms.remove(Number(client.data.room));
      } else if (client.data.roomStatus === 'play'){
        console.log('clear ***');
        if (client.data.node.first_logout === "left"){
          client.data.node.playerLeft.score = 0;
          client.data.node.playerRight.score = 10;
        } else if (client.data.node.first_logout === "right"){
          client.data.node.playerRight.score = 0;
          client.data.node.playerLeft.score = 10;
        }
        this.server.to(client.data.room).emit("updateClient", {
          pl: client.data.node.playerLeft,
          pr: client.data.node.playerRight,
          b: client.data.node.ball,
        });
        client.leave(client.data.room);
        this.server.to(client.data.room).emit('leaveRoom');
        clearInterval(client.data.node.gameLoop);
        clearInterval(client.data.node.gameTimer);
        if (client.data.pos === 'left'){
          console.log(client.data.node.playerLeft.score);
          console.log(client.data.node.playerRight.score);
          console.log(client.data.node.first_logout);
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
        if (timer === this.levelUpLogic.time){
          clearInterval(client.data.node.gameTimer);
          clearInterval(client.data.node.gameLoop);
          this.server.to(client.data.room).emit('leaveRoom');
        }
        console.log(timer);
    }, 1000);
  }
}
