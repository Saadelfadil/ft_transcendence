
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
export class OnlineGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {



  private  onlineUsers = {};
  private inGameUsers : Array<number> = [];
	constructor(  
	) {}

    @WebSocketServer() server: Server;
	private logger: Logger = new Logger('MessageGateway');
   

    @SubscribeMessage('online')
    handleOnlineUsers(client, payload: any ): any {
        this.onlineUsers[client.id] = payload.data.userId;
		this.server.emit('online-users', this.onlineUsers);

        return { onlineUsers: this.onlineUsers };
    }
      
    @SubscribeMessage('in-game-user')
    InGameUsers(client, payload:any){
      console.log(`in game players ${this.inGameUsers}`);
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

      delete this.onlineUsers[client.id];

		    this.server.emit('online-users', this.onlineUsers);
    }
    
    handleConnection(client: Socket, ...args: any[]) {
		  this.server.emit('online-users', this.onlineUsers);
    }

       
}
