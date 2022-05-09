import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { BlockModule } from 'src/chat/block/block.module';
import { MessageGateway } from './messages.gateway';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { UserModule } from 'src/users/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Message]), BlockModule, JwtModule.register({
		secret: 'secret',
		signOptions: {expiresIn: '3600s'}
	}), UserModule],
	controllers: [MessagesController],
	providers: [MessagesService, MessageGateway]
})
export class MessagesModule {}
