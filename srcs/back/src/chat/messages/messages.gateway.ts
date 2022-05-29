import { BlockService } from "src/chat/block/block.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";


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
	namespace: 'privateChat',
	cors: {
	  origin: '*',
	}
  })


   export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly blockService: BlockService,
		private readonly messagesService: MessagesService

	) {}
   
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('MessageGateway');
   
	@SubscribeMessage('private-chat')
	async handleMessage(client: Socket, payload: any) {


		// this.server.emit(payload.data.roomName, payload);
		// return { status: true }


		

		const sessionId : number = +payload.data.from_id;
		const userBlockedList: number[] = await this.blockService.blockedList(+payload.data.to_id);

		if(userBlockedList.includes(sessionId))
		{
			return { status: false }
		}
		else
		{
			if(!payload.data.isInvite)
			{
				let messageDto = new CreateMessageDto();
				messageDto.isInvite = payload.data.isInvite;
				messageDto.to_id = +payload.data.to_id;
				messageDto.msg = payload.data.message;
				const res = await this.messagesService.create(sessionId, messageDto);
				payload.data.id = res.id;
				payload.data.created = res.created;
			}
			else if(payload.data.inviteStatus == 0)
			{
				let messageDto = new CreateMessageDto();
				messageDto.isInvite = payload.data.isInvite;
				messageDto.to_id = +payload.data.to_id;
				messageDto.msg = payload.data.message;
				const res = await this.messagesService.create(sessionId, messageDto);
				payload.data.id = res.id;
				payload.data.created = res.created;
				////console.log("mp2 : ",payload)

			}
			else
			{
				let messageDto = new CreateMessageDto();
				messageDto.inviteStatus = payload.data.inviteStatus;
				messageDto.isInvite = payload.data.isInvite;
				messageDto.to_id = +payload.data.to_id;
				messageDto.msg = payload.data.message;
				messageDto.created = payload.data.created;
				this.messagesService.updateMessage(payload.data.id);
			}
			this.server.emit(payload.data.roomName, payload);
			return { status: true }
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
