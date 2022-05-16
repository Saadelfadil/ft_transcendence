import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BlockService } from "src/chat/block/block.service";


@WebSocketGateway(8009, {cors: true })
export class OnlineGateway {

    private  onlineUsers = {};
	constructor(  
	) {}

    @SubscribeMessage('online')
    handleOnlineUsers(client, payload: any ): any {
        this.onlineUsers[client.id] = payload.data.userId;
        client.broadcast.emit('onlineUsers', this.onlineUsers);
        return { onlineUsers: this.onlineUsers };
    }
      
    handleDisconnect(client, ...args: any[]) {
        delete this.onlineUsers[client.id];
        client.broadcast.emit('onlineUsers', this.onlineUsers);
    }

    handleConnection(client, ...args: any[]) {
        client.broadcast.emit('onlineUsers', this.onlineUsers);

    }
}
