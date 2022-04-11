import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { JwtStrategy } from './jwt-strategy';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'ft_transcendence',
      entities: [UserEntity],
      synchronize: true,
    }
  ),
  TypeOrmModule.forFeature([UserEntity]),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '1d'}
  })
],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
