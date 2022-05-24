import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, ClassSerializerInterceptor, HttpStatus, UseGuards, Req, UseInterceptors } from '@nestjs/common';
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


	@UseInterceptors(ClassSerializerInterceptor)
	@Post()
	async create(@Body() createMessageDto: CreateMessageDto,  @Req() req: Request) {
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		// const sessionId : number = 1;

		// added by saad for protection of Body undefined
		if (createMessageDto.to_id == undefined)
			return;
			
		const userBlockedList: number[] = await this.blockService.blockedList(createMessageDto.to_id);
		if(userBlockedList.includes(sessionId))
			throw new HttpException({ message: 'You can\'t send message to this user!' }, HttpStatus.UNAUTHORIZED);
		return this.messagesService.create(sessionId, createMessageDto);
	}

	// Display Users list with thier last msg
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async findAll(@Req() req: Request) {
		console.log(`normal get request`);
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		
		return this.messagesService.getChatList(sessionId);
	}

	// Get my messages with user (:id)
	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;

		return this.messagesService.findOne(sessionId, +id);
	}


	@UseInterceptors(ClassSerializerInterceptor)
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
		// const sessionId : number = 1;
		const user = await this.userService.getUserDataFromJwt(req);
		const sessionId: number = user.id;
		
		return this.messagesService.removeMessage(sessionId, +id);
	}
}
