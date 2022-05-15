import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

	@IsNotEmpty()
	@IsInt()
	to_id: number;

	@IsNotEmpty()
	@IsString()
	msg: string;

	@IsBoolean()
	isInvite: boolean = false;

	@IsNumber()
	inviteStatus: number = 0;

	@IsNumber()
	created: number = Date.now();
}
