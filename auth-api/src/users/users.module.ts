import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, PassportModule],
  exports: [UsersService, LocalStrategy]
})
export class UsersModule {}
