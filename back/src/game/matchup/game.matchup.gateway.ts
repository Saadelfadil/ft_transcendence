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
import { Match, matchPlayerData } from '../game.entities';
import { roomDb, roomNode } from '../game.interface';
import { GameRepository, MatchRepository } from '../game.repository';
import { GameService } from '../game.service';
import { MatchUpLogic } from './game.matchup.logic';

@WebSocketGateway({
  namespace: 'matchup',
  cors: {
    origin: '*',
  }
})
export class MatchUpGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    @InjectRepository(MatchRepository) private matchRepository: MatchRepository,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private matchUpLogic: MatchUpLogic,
  ){}

  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('GameGateway');
  afterInit(server: Server){
    this.logger.log(`server io initiatted ${server}`);
  }

  handleDisconnect(client: Socket) {
    console.log('-----disconnect socket (matchup)------');
    console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
    this.clear(client);
    console.log('-----end of disconnect socket ------\n');
  }

  checkRoomconnection(client: Socket){
    let room = this.matchUpLogic.joinRoom(client);
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
    console.log('-----connect socket (matchup)------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
  }

  @SubscribeMessage('initGame')
  initGame(client: any): void {
    this.matchUpLogic.initGmae();
    client.data.node.playerLeft = this.matchUpLogic.playerLeft;
    client.data.node.playerRight = this.matchUpLogic.playerRight;
    client.data.node.ball = this.matchUpLogic.ball;
    client.emit("initData", {
      pl: client.data.node.playerLeft,
      pr: client.data.node.playerRight,
      b: client.data.node.ball,
      scw: this.matchUpLogic.canvasW,
      sch: this.matchUpLogic.canvasH,
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
    let node = this.matchUpLogic.rooms.find(Number(client.data.room));
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
        newDbRoom.namespace = 'matchup';
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

      // console.log(`wRooms: ${this.matchUpLogic.wRooms.size}`);
      // this.matchUpLogic.wRooms.values().forEach(element => {
      //   console.log(element);
      // });
      // console.log(`Rooms: ${this.matchUpLogic.rooms.size}`);
      // this.matchUpLogic.rooms.values().forEach(element => {
      //   console.log(element);
      // });

    } else if (data.type === 'stream'){
      console.log(data.room, 'stream');
      client.data.room = data.room;
      client.join(data.room);
      client.emit('canvasWH', {scw: this.matchUpLogic.canvasW, sch: this.matchUpLogic.canvasH});
    }
  }

  clear(client: any){
    if (client.data.type === 'stream'){
      client.leave(client.data.room);
      //client.emit('leaveRoom');
    } else {
      if (client.data.roomStatus === 'waiting'){
        this.server.to(client.data.room).emit('leaveRoom');
        this.userRepository.update(client.data.userId, {in_game: false});
        this.matchUpLogic.wRooms.remove(Number(client.data.room));
      } else if (client.data.roomStatus === 'play'){
        client.leave(client.data.room);
        this.server.to(client.data.room).emit('leaveRoom');
        clearInterval(client.data.node.gameLoop);
        if (client.data.pos === 'left'){
          this.matchRepository.addMatchData(client.data.node, 'matchup');
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
        this.matchUpLogic.rooms.remove(Number(client.data.room));
        this.gameRepository.deleteRoom(client.data.room);
      }
    }
  }

  // async addMatchData(data: roomNode){
  //   let newMatch = new Match();
  //   newMatch.data = [];
  //   for (let i = 0; i < 2; i++){
  //     let player = {} as matchPlayerData;
  //     player.id = data.players[i];
  //     if (i === 0)
  //       player.score = data.playerLeft.score;
  //     else
  //       player.score = data.playerRight.score;
  //     newMatch.data.push(player);
  //   }
  //   newMatch.date = new Date();
  //   await newMatch.save();
  // }

  startGame(client: any){
    // let users = ['1', '2', '3', '4', '5', '6', '7'];
    // let result = users.sort(() => .5 - Math.random()).slice(0,2);
    // console.log(result);
    // client.data.node.players[0] = result[0];
    // client.data.node.players[1] = result[1];
    client.data.node.gameLoop = setInterval(() => {
        this.matchUpLogic.update(client.data);
        this.server.to(client.data.room).emit("updateClient", {
          pl: client.data.node.playerLeft,
          pr: client.data.node.playerRight,
          b: client.data.node.ball,
        });
    }, 1000/64);
  }

}
