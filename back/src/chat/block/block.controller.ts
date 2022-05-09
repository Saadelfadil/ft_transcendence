import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AppService } from 'src/users/app.service';
import { AuthenticatedGuard } from 'src/users/auth.guard';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { Request } from 'express';

@UseGuards(AuthenticatedGuard)
@Controller('block')
export class BlockController {
		constructor(private readonly blockService: BlockService,
		private readonly userService: AppService,
		) {}

	@Post()
	async blockUser(@Body() createBlockDto: CreateBlockDto, @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId: number = 1; // TODO: get it from jwt
		return this.blockService.blockUser(sessionId, createBlockDto);
	}

	@Get('users')
	async blockedList(@Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// TODO: get it from jwt
		return this.blockService.blockedListUsers(sessionId); // Return list of all blocked users
	}
	
	@Delete()
	async unBlockUser(@Body() createBlockDto: CreateBlockDto, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// TODO: get it from jwt
		return this.blockService.unBlockUser(sessionId, createBlockDto);
	}

	@Get(':id')
	async isBlocked(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		// const sessionId: number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// TODO: get it from jwt
		return this.blockService.isBlocked(sessionId, +id);
	}
}
