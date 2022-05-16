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



// (isInvite == true &&  inviteStatus == 0 && to_id == myId ) ==> accept invite ===> inviteStatus (1)
// (isInvite == true &&  inviteStatus == 1 && from_id == myId ) ==> your invite has been accepted 



// inviteStatus == 0 ===> new invite
// inviteStatus == 1 ===> accepted invite
// inviteStatus == 2 ===> rejected invite
// inviteStatus == 3 ===> invite creator clicked play