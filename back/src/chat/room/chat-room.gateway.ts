
import { BanService } from "src/chat/ban/ban.service";
import { AppModule } from "src/app.module";
import { CreateRoomMessageDto } from "./dto/create-room-message.dto";
import { RoomService } from "./room.service";
import { AppService } from "src/users/app.service";

import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
   } from '@nestjs/websockets';
   import { Logger } from '@nestjs/common';
   import { Socket, Server } from 'socket.io';
   

   @WebSocketGateway({
	namespace: 'publicChat',
	cors: {
	  origin: '*',
	}
  })


   export class ChatRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly banService: BanService,
		private readonly roomService: RoomService,
		private readonly usersService: AppService

	) {}
   
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('MessageGateway');
   
	@SubscribeMessage('public-chat')
	async handleMessage(client: Socket, payload: any) {


		const sessionId : number = +payload.data.from_id;
		// // banned list
		const roomBannedList: number[] = await this.banService.roomBannedList(+payload.data.roomName);
		if(roomBannedList.includes(sessionId))
		{
			return { status: false } // console.log("blocked");
		}
		else
		{
			let messageDto = new CreateRoomMessageDto();
			messageDto.room_id = +payload.data.roomName;
			messageDto.msg = payload.data.message;
			this.roomService.saveMessageToRoom(sessionId, messageDto).then((saved_msg:any)=>{
				payload.data.id = saved_msg.id;
				this.server.emit(payload.data.roomName, payload);
			});
			


            
            return { status: true }
		}
		

	}

    @SubscribeMessage('leave-room')
	async leaveRoom(client, payload: any) {
		const sessionId : number = +payload.data.from_id;
		const leaveingStatus = this.usersService.leaveRoom(sessionId, +payload.data.roomName);
		if ( leaveingStatus )
		{
			return { status: true }
		}
		else
		{
			return { status: false }
		}
		
	}
   
	afterInit(server: Server) {
	 this.logger.log('Init');
	}
   
	handleDisconnect(client: Socket) {
	 this.logger.log(`Client disconnected: ${client.id}`);
	}
   
	handleConnection(client: Socket, ...args: any[]) {
	//  this.logger.log(`Client connected: ${client.id}`);
	}

}
