import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

@Module({
	imports: [TypeOrmModule.forFeature([Block]), JwtModule.register({
		secret: 'secret',
		signOptions: {expiresIn: '3600s'}
	}), UserModule],
	controllers: [BlockController],
	providers: [BlockService],
	exports: [BlockService]
})
export class BlockModule {}
