import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';
import { RoomMessage } from './entities/room-message.entity';
import { BlockModule } from 'src/chat/block/block.module';
import { BanModule } from 'src/chat/ban/ban.module';
import { ChatRoomGateway } from './chat-room.gateway';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

@Module({
	imports: [TypeOrmModule.forFeature([Rooms, RoomMessage]), BlockModule, BanModule,
	JwtModule.register({
		secret: 'secret',
		signOptions: {expiresIn: '3600s'}
	}), UserModule],
	controllers: [RoomController],
  	providers: [RoomService, ChatRoomGateway],
  	exports: [RoomService]
})
export class RoomModule {}
