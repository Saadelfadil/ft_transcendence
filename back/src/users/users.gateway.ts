
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
   } from '@nestjs/websockets';
   import { Socket, Server } from 'socket.io';
   
   import { Logger } from '@nestjs/common';

   @WebSocketGateway({
	namespace: 'onlineUsers',
	cors: {
	  origin: '*',
	}
  })
export class OnlineGateway implements OnGatewayInit , OnGatewayDisconnect{



  private  onlineUsers : Array<number> = [];
  private  onlineUsersSockets : Array<string> = [];
  private inGameUsers : Array<number> = [];
	constructor(  
	) {}

    @WebSocketServer() server: Server;
	private logger: Logger = new Logger('MessageGateway');
   

    @SubscribeMessage('online-state')
    handleOnlineUsers(client, payload: any ): any {

        
        this.onlineUsers.push(payload.user_id);
        this.onlineUsersSockets.push(client.id); // i will use this to remove user_id from array at disconnect

        this.server.emit('online-users', this.onlineUsers);

        return { onlineUsers: this.onlineUsers, inGameUsers: this.inGameUsers};
    }
      
    @SubscribeMessage('in-game-user')
    InGameUsers(client, payload:any){
  
      if (payload.playing){
        this.inGameUsers.push(payload.user_id);
        this.server.emit('all-users-in-game', this.inGameUsers);
      }
      else{
        this.inGameUsers.map((id, index) => {
          if (id === payload.user_id)
          {
            this.inGameUsers.splice(index, 1);
            this.server.emit('all-users-in-game', this.inGameUsers);
            return ;
          }
        });
      }
    }

    afterInit(server: Server) {
    }

    handleDisconnect(client: Socket) {
      this.onlineUsersSockets.map((sock_id, index:number) => {
        if (sock_id == client.id)
        {
          this.onlineUsersSockets.splice(index, 1);
          this.onlineUsers.splice(index, 1);
          return ;
        }
      });
      this.server.emit('online-users', this.onlineUsers);
    }
}


