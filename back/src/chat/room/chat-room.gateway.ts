import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BanService } from "src/chat/ban/ban.service";
import { AppModule } from "src/app.module";
import { CreateRoomMessageDto } from "./dto/create-room-message.dto";
import { RoomService } from "./room.service";
import { AppService } from "src/users/app.service";

@WebSocketGateway(8000, {cors: true })
export class ChatRoomGateway {

	constructor(
		private readonly banService: BanService,
		private readonly roomService: RoomService,
		private readonly usersService: AppService

	) {}

	@SubscribeMessage('chat-room')
	async handleMessage(client, payload: any ) {

		const sessionId : number = +payload.data.from;
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
			this.roomService.saveMessageToRoom(sessionId, messageDto);

			// payload.data.from = sessionId;
			client.broadcast.to(payload.data.roomName).emit("message", payload);
			return { status: true }
		}
	}

	@SubscribeMessage('join-room')
	async joinRoom(client, payload: any) {
		// TODO: join the room
		// get room data (if it's private or public)
		const authStatus = await this.roomService.checkAuth(+payload.data.roomName, payload.data.password);
		if ( authStatus )
		{
			const sessionId : number = +payload.data.from;
			this.usersService.joinRoom(+sessionId, +payload.data.roomName);
			client.join(payload.data.roomName);
			return { status: true }
		}
		else
		{
			return { status: false }
		}
		
	}


	@SubscribeMessage('leave-room')
	async leaveRoom(client, payload: any) {



		
		const sessionId : number = +payload.data.from;

		const leaveingStatus = this.usersService.leaveRoom(sessionId, +payload.data.roomName);
		if ( leaveingStatus )
		{
			client.leave(payload.data.roomName);
			return { status: true }
		}
		else
		{
			return { status: false }
		}
		
	}


	@SubscribeMessage('join-room-m')
	async joinRoomM(client, payload: any) {
		client.join(payload.data.roomName);		
	}

	
	

}