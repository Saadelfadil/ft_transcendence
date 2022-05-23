import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseIntPipe, Inject, forwardRef, HttpException, HttpStatus, ClassSerializerInterceptor, UseGuards, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { BlockService } from 'src/chat/block/block.service';
import { BanService } from 'src/chat/ban/ban.service';
import { AuthenticatedGuard } from 'src/users/auth.guard';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';
import passport from 'passport';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(AuthenticatedGuard)
@Controller('room')
export class RoomController {

  	constructor(
		private readonly roomService: RoomService,
		private readonly blockService: BlockService,
		private readonly userService: AppService,
		@Inject(forwardRef(() => BanService))
    	private banService: BanService,

	) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post()
	async create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		
		return this.roomService.create(sessionId, createRoomDto);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	findAll() {
		return this.roomService.findAll();
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('checkroompass')
	async IsRoomPassValid(@Body() body, @Req() req: Request){
		const user = await this.userService.getUserDataFromJwt(req);
		let status:boolean = true;
		if (body.room_pass !== '')
			status = await this.roomService.checkAuth(body.room_id, body.room_pass);
		if (status){
			// here i will add to joinedrooms id of the joined room
			this.userService.addRoomIdToJoinedRooms(user.id, body.room_id);
		}
		return {status: status};
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('leaveroom')
	async LeaveRoom(@Body() body, @Req() req:Request){
		const user = await this.userService.getUserDataFromJwt(req);
		await this.userService.removeRoomIdFromJoinedRooms(user.id, body.room_id);
		return {status:true};
	}


	// TODO: should be protected : only edit only from room owner
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: string) {
		return this.roomService.findOne(+id);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: string, @Body() changePasswordDto: ChangePasswordDto, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId: number = 1;
		return this.roomService.update(sessionId, +id, changePasswordDto);

	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId: number = 1;
		await this.roomService.remove(sessionId, +id);
		// added by mohamed
		this.userService.removeFromJoinedRooms(+id);
	}


	// Sould display room messages only if the room id exists in rooms[] jwt
	// Get room messages
	@Get(':roomId/messages')
	async findRoomMessages(@Param('roomId', ParseIntPipe) roomId: string, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		// my blocked list
		const myBlockedList: number[] = await this.blockService.blockedList(sessionId);

		return this.roomService.findRoomMessages(sessionId, myBlockedList, +roomId);
	}

	// Save msg to room
	// Sould display room messages only if the room id exists in rooms[] jwt
	@Post(':roomId')
	async saveMessageToRoom(@Param('roomId', ParseIntPipe) roomId: string, @Body() createRoomMessageDto: CreateRoomMessageDto, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		const roomBannedList: number[] = await this.banService.roomBannedList(+roomId);
		if(roomBannedList.includes(sessionId))
			throw new HttpException({ message: 'You can\'t participate in this room' }, HttpStatus.UNAUTHORIZED);

		return this.roomService.saveMessageToRoom(sessionId, createRoomMessageDto);
	}

	@Post(':roomId/add-admin')
	async addRoomAdmin(@Param('roomId', ParseIntPipe) roomId: string, @Body() data: string, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		const roomData =  await this.roomService.findOne(+roomId);
		if( sessionId == roomData.owner_id || roomData.admins.includes(sessionId) )
		{
			return this.roomService.addRoomAdmin(+roomId, +data['user_id']);
		}
		else
			throw new HttpException({ message: 'Unauthorized operation' }, HttpStatus.UNAUTHORIZED);


	}
	@Post(':roomId/remove-admin')
	async removeRoomAdmin(@Param('roomId', ParseIntPipe) roomId: string, @Body() data: string, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId: number = 1;

		const roomData =  await this.roomService.findOne(+roomId);
		if( sessionId == roomData.owner_id || roomData.admins.includes(sessionId) )
		{
			const saved = await this.roomService.removeRoomAdmin(+roomId, +data['user_id']);
			if(saved)
				return { status : true }
			else
				return { status : false }
		}
		else
			throw new HttpException({ message: 'Unauthorized operation' }, HttpStatus.UNAUTHORIZED);

	}

}
