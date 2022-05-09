import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

	@IsNotEmpty()
	@IsInt()
	to_id: number;

	@IsNotEmpty()
	@IsString()
	msg: string;

	@IsNumber()
	created: number = Date.now();
}
