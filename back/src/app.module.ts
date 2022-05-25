import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserFriendsEntity } from './users/userFriends.entity';
import { UserGameEntity } from './users/userGame.entity';
import { UserHistoryEntity } from './users/userHistory.entity';
import { GameModule } from './game/game.module';
import { MessagesModule } from './chat/messages/messages.module';
import { RoomModule } from './chat/room/room.module';
import { BanModule } from './chat/ban/ban.module';
import { UserModule } from './users/user.module';
import { Message } from './chat/messages/entities/message.entity';
import { Ban } from './chat/ban/entities/ban.entity';
import { RoomMessage } from './chat/room/entities/room-message.entity';
import { Match, Room} from './game/game.entities';
import { Rooms } from './chat/room/entities/room.entity';
import { Block } from './chat/block/entities/block.entity';
import { BlockModule } from './chat/block/block.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin',
      database: process.env.DB_NAME || 'ft_transcendence',
      entities: [UserEntity, UserFriendsEntity, UserGameEntity, UserHistoryEntity, Room, Match, Message, Ban, Block, RoomMessage, Rooms],
      synchronize: true,
    },
  ),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '3600s'}
  }),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  GameModule,
  MessagesModule,
  RoomModule,
  BanModule,
  BlockModule,
  UserModule,
],
  controllers: [],
  exports: [],
  providers: [],
})
export class AppModule {}
