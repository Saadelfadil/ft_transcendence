import { Exclude } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Rooms } from '../entities/room.entity';

export class ChangePasswordDto {
	@IsOptional()
	@IsString()
	password: string;
}
