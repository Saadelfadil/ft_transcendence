import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomMessageDto {

	@IsNotEmpty()
	@IsInt()
	room_id: number;
	
	@IsNotEmpty()
	@IsString()
	msg: string;

	@IsNumber()
	created: number = Date.now();
}
