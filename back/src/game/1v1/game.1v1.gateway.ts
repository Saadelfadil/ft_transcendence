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
    console.log('-----connect socket (onevone)------');
    console.log(`connect: ${client.id}`);
    console.log('-----end of connect socket ------\n');
    //client.data = this.levelUpLogic.addClient(client.id); --> warmup logic
  }
  
  handleDisconnect(client: Socket) {
    console.log('-----disconnect socket (onevone)------');
    console.log(`disconnect: ${client.id}`);
    this.clear(client);
    console.log('-----end of disconnect socket ------\n');
    //this.levelUpLogic.wclients.find(client.id)
    //this.levelUpLogic.rmClient(client.id);
    //this.logger.log(`client disconnected ${client}`);
  }

  clear(client: Socket){
    if(client.data.pos === 'left'){
      this.oneVoneLogic.rooms.remove(Number(client.data.room));
      clearInterval(client.data.roomNode.gameLoop);
      clearInterval(client.data.roomNode.gameTimer);
    }
    client.leave(client.data.room);
    this.server.to(client.data.room).emit('leaveRoom');
    
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
      console.log(`${client.id}: ${client.data.pos} set room: ${client.data.room}.`)
      console.log(client.data.roomNode);
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
          // let newDbRoom = {} as roomDb;
          // newDbRoom.name = room.id;
          // newDbRoom.players = room.players;
          // newDbRoom.namespace = 'levelup';
          // this.gameRepository.addRoom(newDbRoom);
          //this.gameRepository.getAllRooms();
        }, timer * 1000);
        console.log(`${client.id}: ${client.data.pos} join the room: ${client.data.room}.`)
        console.log(client.data.roomNode);
        this.startGame(client);
      } else {
        client.emit('noRoom');
      }
    }
  }


  //@SubscribeMessage('startGame')
  startGame(client: any){
    //this.startTime(client);
    client.data.roomNode.gameLoop = setInterval(() => {
        this.oneVoneLogic.update(client.data);
        this.server.to(client.data.room).emit("updateClient", {
          pl: client.data.roomNode.playerLeft,
          pr: client.data.roomNode.playerRight,
          b: client.data.roomNode.ball,
        });
    }, 1000/64);
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
    client.data.pos = 'right';
    client.data.room = room;
    if (this.oneVoneLogic.rooms.find(Number(client.data.room))){
      this.server.to(client.data.room).emit('leaveRoom');
    }
    console.log(room);
  }
}
