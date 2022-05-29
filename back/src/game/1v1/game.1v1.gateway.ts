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
import { oneVoneLogic } from './game.1v1.logic';

@WebSocketGateway({
  namespace: 'onevone',
  cors: {
    origin: '*',
  }
})
export class oneVoneGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRepository(GameRepository) private gameRepository: GameRepository,
    @InjectRepository(MatchRepository) private matchRepository: MatchRepository,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private oneVoneLogic: oneVoneLogic,
  ){}

  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('onevone');
  afterInit(server: Server){
    this.logger.log(`server io initiatted ${server}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.gameService.rooms.push(client.id);
    ////console.log('-----connect socket (onevone)------');
    ////console.log(`connect: ${client.id}`);
    ////console.log('-----end of connect socket ------\n');
    //client.data = this.levelUpLogic.addClient(client.id); --> warmup logic
  }
  
  handleDisconnect(client: Socket) {
    ////console.log('-----disconnect socket (onevone)------');
    ////console.log(`disconnect: ${client.id}`);
    this.clear(client);
    ////console.log(this.oneVoneLogic.rooms.size)
    ////console.log('-----end of disconnect socket ------\n');
    //this.levelUpLogic.wclients.find(client.id)
    //this.levelUpLogic.rmClient(client.id);
    //this.logger.log(`client disconnected ${client}`);
  }

  clear(client: Socket){
    if (client.data.type === 'stream'){
      client.leave(client.data.room);
      client.emit('leaveRoom');
    } else {
      client.leave(client.data.room);
      this.server.to(client.data.room).emit('leaveRoom');
      if (client.data.roomNode){
        clearInterval(client.data.roomNode.gameLoop);
        clearInterval(client.data.roomNode.gameTimer);
      }
      if(client.data.pos === 'right'){
        ////console.log('add data', client.data.roomNode);
        this.matchRepository.addMatchData(client.data.roomNode, 'onevone');
          if (client.data.roomNode.playerLeft.score > client.data.roomNode.playerRight.score){
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 3",
                                  wins: () => "wins + 1"
                                }).where("id = :id", { id: client.data.roomNode.players[0]}).execute();
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  loss: () => "loss + 1"
                                }).where("id = :id", { id: client.data.roomNode.players[1]}).execute();
          } else if (client.data.roomNode.playerLeft.score < client.data.roomNode.playerRight.score) {
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 3",
                                  wins: () => "wins + 1"
                                }).where("id = :id", { id: client.data.roomNode.players[1]}).execute();
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  loss: () => "loss + 1"
                                }).where("id = :id", { id: client.data.roomNode.players[0]}).execute();
          } else {
            this.userRepository.createQueryBuilder()
                                .update(UserEntity).set({
                                  points: () => "points + 1"
                                }).where("id = :id0 AND id = :id1", { id0: client.data.roomNode.players[0], id1: client.data.roomNode.players[1]}).execute();
          }
          this.userRepository.update(Number(client.data.roomNode.players[0]), {in_game: false});
          this.userRepository.update(Number(client.data.roomNode.players[1]), {in_game: false});
      }
      this.gameRepository.deleteRoom(client.data.room);
      this.oneVoneLogic.rooms.remove(Number(client.data.room));
    }
    
  }

  initData(client:Socket){
    client.emit('initData', {
        pl: client.data.roomNode.playerLeft,
        pr: client.data.roomNode.playerRight,
        b: client.data.roomNode.ball,
        scw: this.oneVoneLogic.canvasW,
        sch: this.oneVoneLogic.canvasH,
      });
  }

  @SubscribeMessage('setRoom')
  setRoom(client: Socket, data: any){
    client.data.pos = data.pos;
    client.data.room = data.room;
    client.data.userId = data.id;
    if (client.data.pos === 'left'){
      client.data.roomNode = this.oneVoneLogic.addRoom(client);
      this.initData(client);
      ////console.log(`${client.id}: ${client.data.pos} set room: ${client.data.room}.`)
      ////console.log(client.data.roomNode);
    } else if (client.data.pos === 'right'){
      let node = this.oneVoneLogic.rooms.find(Number(client.data.room));
      if (node){
        node.data.size++;
        node.data.players.push(client.data.userId);
        client.join(node.data.id);
        client.data.roomNode = node.data;
        this.initData(client);
        let timer = 5;
        this.server.to(client.data.room).emit('rightJoined', timer, client.data.roomNode.players);
        setTimeout(() => {
          this.server.to(client.data.room).emit('startMouseEvent');
          this.startGame(client);
          let newDbRoom = {} as roomDb;
          newDbRoom.name = client.data.roomNode.id;
          newDbRoom.players = client.data.roomNode.players;
          newDbRoom.namespace = 'onevone';
          this.gameRepository.addRoom(newDbRoom);
          this.userRepository.update(Number(client.data.roomNode.players[0]), {in_game: true});
          this.userRepository.update(Number(client.data.roomNode.players[1]), {in_game: true});
        }, timer * 1000);
        ////console.log(`${client.id}: ${client.data.pos} join the room: ${client.data.room}.`)
        ////console.log(client.data.roomNode);
        //this.gameRepository.getAllRooms();
      } else {
        client.data.pos = '';
        client.emit('noRoom');
      }
    }
  }

  @SubscribeMessage('clientType')
  clientType(client: any, data: any): void {
    client.data.type = data.type;
    client.data.room = data.room;
    if (data.type === 'stream'){
      client.join(data.room);
      client.emit('canvasWH', {scw: this.oneVoneLogic.canvasW, sch: this.oneVoneLogic.canvasH});
    }
  }

  //@SubscribeMessage('startGame')
  startGame(client: any){
    this.startTime(client);
    client.data.roomNode.gameLoop = setInterval(() => {
        this.oneVoneLogic.update(client.data);
        this.server.to(client.data.room).emit("updateClient", {
          pl: client.data.roomNode.playerLeft,
          pr: client.data.roomNode.playerRight,
          b: client.data.roomNode.ball,
        });
    }, 1000/64);
  }

  startTime(client: any){
    let start = Date.now();
    ////console.log('start time', client.data.roomNode);
    client.data.roomNode.gameTimer = setInterval(() => {
        let delta = Date.now() - start;
        let timer = Math.floor(delta / 1000);
        client.data.roomNode.time = timer;
        if (client.data.roomNode.time % 5 === 0){
          ////console.log("1v1");
          client.data.roomNode.ball.speed += 0.3;
          client.data.roomNode.playerLeft.h -= 3;
          client.data.roomNode.playerRight.h -= 3;
        }
        this.server.to(client.data.room).emit("updateTime", client.data.roomNode.time);
        if (timer === this.oneVoneLogic.time){
          clearInterval(client.data.roomNode.gameTimer);
          clearInterval(client.data.roomNode.gameLoop);
          this.server.to(client.data.room).emit('leaveRoom');
        }
        ////console.log(timer);
    }, 1000);
  }

  @SubscribeMessage('updatePos')
  updatePos(client: any, curspos: number): void {
    if (client.data.pos === 'left'){
      client.data.roomNode.playerLeft.y = curspos - client.data.roomNode.playerLeft.h/2;
    } else if (client.data.pos === 'right') {
      client.data.roomNode.playerRight.y = curspos - client.data.roomNode.playerRight.h/2;
    }
  }

  @SubscribeMessage('decline')
  decline(client: Socket, room: string){
    client.data.pos = '';
    client.data.room = room;
    if (this.oneVoneLogic.rooms.find(Number(client.data.room))){
      this.server.to(client.data.room).emit('leaveRoom');
    }
    ////console.log(room);
  }
}
