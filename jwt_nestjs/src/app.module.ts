import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  TypeOrmModule.forFeature([UserEntity])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
