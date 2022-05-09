import { IsBoolean, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { isBigInt64Array } from 'util/types';



export class CreateBanDto {

	@IsNotEmpty()
	@IsBoolean()
	banned: boolean;

	@IsNotEmpty()
	@IsInt()
	user_id: number;

	@IsNotEmpty()
	@IsInt()
	room_id: number;


	@IsNotEmpty()
	@IsInt()
	duration: number;

	@IsNumber()
	created: number = Date.now();

}
