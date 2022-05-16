import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BlockService } from "src/chat/block/block.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";


@WebSocketGateway(8001, {cors: true })
export class MessageGateway {

	constructor(
		private readonly blockService: BlockService,
		private readonly messagesService: MessagesService

	) {}

	@SubscribeMessage('private-chat')
	async handleMessage(client, payload: any ) {

		const sessionId : number = +payload.data.from;
		const userBlockedList: number[] = await this.blockService.blockedList(+payload.data.to);
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
				messageDto.to_id = +payload.data.to;
				messageDto.msg = payload.data.message;
				this.messagesService.create(sessionId, messageDto);
			}
			else if(payload.data.inviteStatus == 0)
			{
				let messageDto = new CreateMessageDto();
				messageDto.isInvite = payload.data.isInvite;
				messageDto.to_id = +payload.data.to;
				messageDto.msg = payload.data.message;
				this.messagesService.create(sessionId, messageDto);
			}
			else
			{

				let messageDto = new CreateMessageDto();
				messageDto.inviteStatus = payload.data.inviteStatus;
				messageDto.isInvite = payload.data.isInvite;
				messageDto.to_id = +payload.data.to;
				messageDto.msg = payload.data.message;
				messageDto.created = payload.data.created;
				this.messagesService.updateMessage(messageDto);
			}

			

			client.broadcast.to(payload.data.roomName).emit("message", payload);
			return { status: true }
		}
	}

	@SubscribeMessage('join-user')
	async joinRoom(client, payload: any) {
		client.join(payload.data.roomName);
	}
}