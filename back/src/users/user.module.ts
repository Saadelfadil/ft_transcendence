import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './user.entity';
import { UserFriendsEntity } from './userFriends.entity';
import { UserHistoryEntity } from './userHistory.entity';
import { OnlineGateway } from './users.gateway';


@Module({
  imports: [
  TypeOrmModule.forFeature([UserEntity, UserFriendsEntity, UserHistoryEntity]),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '3600s'}
  })
],
  controllers: [AppController],
  exports: [AppService],
  providers: [AppService, OnlineGateway],
})
export class UserModule {}
