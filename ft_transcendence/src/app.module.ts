import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'ft_transcendence',
      entities: [UserEntity, UserFriendsEntity, UserGameEntity, UserHistoryEntity],
      synchronize: true,
    },
    
  ),
  TypeOrmModule.forFeature([UserEntity, UserFriendsEntity, UserGameEntity, UserHistoryEntity]),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '3600s'}
  }),
  ConfigModule.forRoot({
    isGlobal: true,
  })
],
  controllers: [AppController],
  exports: [AppService],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
