import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBlockDto {

	@IsNumber()
	blocked: number;
}
