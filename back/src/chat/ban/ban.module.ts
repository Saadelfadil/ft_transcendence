import { forwardRef, Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ban } from './entities/ban.entity';
import { RoomModule } from 'src/chat/room/room.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { UserModule } from 'src/users/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Ban]), forwardRef(() => RoomModule),
	JwtModule.register({
		secret: 'secret',
		signOptions: {expiresIn: '3600s'}
	}), UserModule],
	controllers: [BanController],
  	providers: [BanService],
	exports: [BanService]
})
export class BanModule {}
