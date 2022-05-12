import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BlockService } from 'src/chat/block/block.service';
import { AuthenticatedGuard } from 'src/users/auth.guard';
import { Request } from 'express';
import { AppService } from 'src/users/app.service';

@UseGuards(AuthenticatedGuard)
@Controller('messages')
export class MessagesController {
  constructor(
	  private readonly messagesService: MessagesService,
	  private readonly blockService: BlockService,
	  private readonly userService: AppService,
	 ) {}

	/*
	// Save message
		- from_id, to_id, msg
	*/
	@Post()
	async create(@Body() createMessageDto: CreateMessageDto,  @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId : number = 1;
		const userBlockedList: number[] = await this.blockService.blockedList(createMessageDto.to_id);
		if(userBlockedList.includes(sessionId))
			throw new HttpException({ message: 'You can\'t send message to this user!' }, HttpStatus.UNAUTHORIZED);
		return this.messagesService.create(sessionId, createMessageDto);
	}

	// Display Users list with thier last msg
	@Get()
	async findAll(@Req() req: Request) {
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		
		return this.messagesService.getChatList(sessionId);
		// return this.messagesService.findAll();
	}

	// Get my messages with user (:id)
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		

		return this.messagesService.findOne(sessionId, +id);
	}

	// Delete all messages that i've had with this user
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		
		return this.messagesService.remove(sessionId, +id);
	}
}