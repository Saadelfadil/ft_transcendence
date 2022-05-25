import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomMessage } from './entities/room-message.entity';
import { Rooms } from './entities/room.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class RoomService {


	constructor(
		@InjectRepository(Rooms)
		private roomsRepository: Repository<Rooms>,

		@InjectRepository(RoomMessage)
		private roomsMessagesRepository: Repository<RoomMessage>,
	) {}

	arrayRemove(roomAdmins: number[], userId: number) { 
        return roomAdmins.filter(function(ele){ 
            return ele != userId; 
        });
    }


	async create(sessionId: number, createRoomDto: CreateRoomDto) {
		let test = await this.roomsRepository.findOne({name: createRoomDto.name});
		if (createRoomDto.name == undefined || createRoomDto.locked == undefined || createRoomDto.password == undefined)
			return ;
		if (test !== undefined)
		{
			// means that already room with this name
			return { status: false, error: 'there exists room with this name!' };
		}
		createRoomDto.admins = [];
		createRoomDto.admins.push(sessionId);
		const newRoom = this.roomsRepository.create(createRoomDto);
		if( newRoom.locked )
		{
			const saltOrRounds = 10;
			const password = newRoom.password;
			const hash = await bcrypt.hash(password, saltOrRounds);
			newRoom.password = hash;
		}
		else
		{
			newRoom.password = "";
		}
		newRoom.owner_id = sessionId;
		const data = await this.roomsRepository.save(newRoom);
		if(data)
		{
			return {
				status: true,
				roomData : data
			};
		}
		else
		{
			return { status: false, error: 'backend failure' };
		}
	}

	// Get room messages list
	async findRoomMessages(sessionId: number, excludeUsersList: number[], roomId: number) {

		let whereBlock: string;

		if( excludeUsersList.length > 0 )
			whereBlock = `AND public."users".id NOT IN ( ${excludeUsersList.join(",")} )`;
		else
			whereBlock = ``;

		const data = await getConnection().query(`
			SELECT *  FROM
				public."room_message"
				JOIN
						public."users"
					ON
						public."users".id = public."room_message".from_id
				WHERE public."room_message".room_id = ${roomId} 
				${whereBlock}
				ORDER BY
				public."room_message".id ASC;
		`);
		if (!data)
			throw new HttpException({ message: 'Room Not Found' }, HttpStatus.NOT_FOUND);
		return data;
	}

	// Save room message
	saveMessageToRoom(sessionId: number, createRoomMessageDto: CreateRoomMessageDto) {
		const newRoomMessage = this.roomsMessagesRepository.create(createRoomMessageDto);
		newRoomMessage.from_id = sessionId;
		return this.roomsMessagesRepository.save(newRoomMessage);
	}

	findAll() {
		return this.roomsRepository.find();
	}

	async findOne(id: number) {
		const data = await this.roomsRepository.findOne(id);
		if (!data)
			throw new HttpException({ message: 'Room Not Found' }, HttpStatus.NOT_FOUND);
		return data;
	}

	async update(sessionId: number ,id: number, changePasswordDto: ChangePasswordDto) {
		const room = await this.findOne(id);

		if(sessionId != room.owner_id)
			throw new HttpException({ message: 'You can\'t edit this room!' }, HttpStatus.UNAUTHORIZED);

		room.password = changePasswordDto.password;

		if( changePasswordDto.password != "" )
		{
			room.locked = true;
			const saltOrRounds = 10;
			const password = changePasswordDto.password;
			const hash = await bcrypt.hash(password, saltOrRounds);
			room.password = hash;
		}
		else
		{
			room.locked = false;
		}
		
		return this.roomsRepository.save(room);
	}

	async remove(sessionId: number, id: number) {
		const room = await this.findOne(id);
		if(sessionId != room.owner_id)
			throw new HttpException({ message: 'You can\'t edit this room!' }, HttpStatus.UNAUTHORIZED);

		if(room)
			return this.roomsRepository.remove(room);
	}

	async checkAuth(roomId: number, password: string) {
		const roomData = await this.findOne(roomId);

		if( !roomData.locked )
			return true;
		else
		{
			const passwordsMatch = await bcrypt.compare(password, roomData.password);
			if ( passwordsMatch )
				return true;
			else
				return false;
		}
	}

	async addRoomAdmin(roomId: number, userId: number) {
		const room = await this.findOne(roomId);

		if(!room.admins.includes(userId))
			room.admins.push(userId);
		
		const data = await this.roomsRepository.save(room);
		
		if( data )
			return { status: true }
		else
			return { status: false }
	}

	async removeRoomAdmin(roomId: number, userId: number) {
		const room = await this.findOne(roomId);

		if(room.admins.includes(userId))
			room.admins = this.arrayRemove(room.admins, userId);

		const data = await this.roomsRepository.save(room);
	
		if( data )
			return { status: true }
		else
			return { status: false }
	}
	
}
