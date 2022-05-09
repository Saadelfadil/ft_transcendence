import { Logger } from '@nestjs/common';
import { OnGatewayConnection,
          OnGatewayDisconnect,
          OnGatewayInit,
          SubscribeMessage,
          WebSocketGateway,
          WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { Stream } from 'stream';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('GameGateway');
  afterInit(server: Server){
    this.logger.log(`server io initiatted ${server}`);
  }

  handleDisconnect(client: Socket) {
    console.log('-----disconnect socket ------');
    console.log(`disconnect: ${client.id}`);
    
    console.log('-----end of disconnect socket ------\n');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('-----connect socket (game)------');
    console.log(`heereconnect: ${client.id}`);
    this.server.on('clientType', (type: string) => {
      if (type === 'stream'){
        console.log(type);
      }
    });
    console.log('-----end of connect socket ------\n');
    //client.data = this.gameLogic.addClient(client.id); --> warmup logic
  }

}
