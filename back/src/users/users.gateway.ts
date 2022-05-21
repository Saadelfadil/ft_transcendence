
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
