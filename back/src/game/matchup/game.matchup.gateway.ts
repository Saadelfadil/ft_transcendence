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
    console.log('-----disconnect socket ------');
    console.log(`disconnect: ${client.id} --> ${client.data.room} : ${client.data.roomStatus}`);
    this.clear(client);
    console.log(`wRooms: ${this.matchUpLogic.wRooms.size}`);
    console.log(`Rooms: ${this.matchUpLogic.rooms.size}`);
    console.log('-----end of disconnect socket ------\n');
    //this.matchUpLogic.wclients.find(client.id)
    //this.matchUpLogic.rmClient(client.id);
    //this.logger.log(`client disconnected ${client}`);
  }

  checkRoomconnection(client: Socket){
    let room = this.matchUpLogic.joinRoom(client);
    if (room){
      //client.data.room = room;
      //console.log(client.data.node);
      client.emit('connectedToRoom', room, client.data.pos);
      setTimeout(() => {
        this.server.to(room.id).emit('roomCreated', room.id, room.players);
        let newDbRoom = {} as roomDb;
        newDbRoom.name = room.id;
        newDbRoom.players = room.players;
        newDbRoom.namespace = 'matchup';
        this.gameRepository.addRoom(newDbRoom);
        //this.gameRepository.getAllRooms();
      }, 5000);
    } else {
      client.emit('waitingForRoom', client.data.pos);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.gameService.rooms.push(client.id);
    console.log('-----connect socket (matchup)------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
    //client.data = this.matchUpLogic.addClient(client.id); --> warmup logic
  }

  @SubscribeMessage('initGame')
  initGame(client: any, canvas: any): void {
    //let initData : {};
    //console.log(`init: ${canvas.canvasW}, ${canvas.canvasH}`);
    //client.data.playerLeft = this.gameLogic.
    let {...data} = this.matchUpLogic.initGmae(canvas.canvasH, canvas.canvasW);
    client.data.node.playerLeft = data.playerLeft;
    client.data.node.playerRight = data.playerRight;
    client.data.node.ball = data.ball;
    //console.log(client.data);
    client.emit("updateClient", {
      pl: data.playerLeft,
      pr: data.playerRight,
      b: data.ball
    });
    if (client.data.pos === 'left')
      this.startGame(client);
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
    let node = this.matchUpLogic.rooms.find(Number(client.data.room));
    if (node){
      client.data.roomStatus = 'play';
      client.data.node = node.data;
    }
  }

  @SubscribeMessage('clientType')
  clientType(client: any, data: any): void {
    client.data.userId = data.userId;
    console.log(client.data.userId);
    client.data.type = data.type;
    if (data.type === 'play'){
      this.userRepository.update(client.data.userId, {in_game: true});
      client.data.node = new roomNode();
      client.data.room = '';
      client.data.roomStatus = 'waiting';
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
      console.log(data.room);
      client.data.room = data.room;
      client.join(data.room);
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
        this.matchUpLogic.wRooms.remove(Number(client.data.room));
      } else if (client.data.roomStatus === 'play'){
        client.leave(client.data.room);
        this.server.to(client.data.room).emit('leaveRoom');
        clearInterval(client.data.node.gameLoop);
        if (client.data.pos === 'left'){
          this.matchRepository.addMatchData(client.data.node, 'matchup');
        }
        console.log(client.data.node);
        this.userRepository.update(Number(client.data.node.players[0]), {in_game: false});
        this.userRepository.update(Number(client.data.node.players[1]), {in_game: false});
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
