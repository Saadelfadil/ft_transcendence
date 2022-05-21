import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, Inject, forwardRef, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/users/auth.guard';
import { RoomService } from 'src/chat/room/room.service';
import { BanService } from './ban.service';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';

@UseGuards(AuthenticatedGuard)
@Controller('ban')
export class BanController {
	constructor(
		private readonly banService: BanService,
		// private readonly roomService: RoomService
		private readonly userService: AppService,
		@Inject(forwardRef(() => RoomService))
    	private roomService: RoomService,
	) {}

	@Post()
	async create(@Body() createBanDto: CreateBanDto, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		createBanDto.created =  Date.now();
		
		const roomData = await this.roomService.findOne(createBanDto.room_id);
		return this.banService.create(sessionId, roomData, createBanDto);
	}

	@Get()
	findAll() {
		return this.banService.findAll();
	}

	@Patch()
	async update(@Body() updateBanDto: UpdateBanDto, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		const roomData = await this.roomService.findOne(updateBanDto.room_id);
		return this.banService.update(sessionId, roomData, updateBanDto);
	}

	
	@Get('room/:roomId/banned')
	roomBannedList(@Param('roomId', ParseIntPipe) roomId: string) {
		return this.banService.roomBannedList(+roomId);
	}

	@Get('room/:roomId/user/:userId')
	findUserInRoom(@Param('roomId', ParseIntPipe) roomId: string, @Param('userId', ParseIntPipe) userId: string) {
		return this.banService.findUserInRoom(+roomId, +userId);
	}

	@Delete('room/:roomId/user/:userId')
	async unbanUserFromRoom(@Param('roomId', ParseIntPipe) roomId: string, @Param('userId', ParseIntPipe) userId: string, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		const roomData = await this.roomService.findOne(+roomId);
		return this.banService.unbanUserFromRoom(sessionId, roomData, +roomId, +userId);

	}

}
