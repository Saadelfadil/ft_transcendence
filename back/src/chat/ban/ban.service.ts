import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from 'src/chat/room/entities/room.entity';
import { RoomService } from 'src/chat/room/room.service';
import { getConnection, Repository } from 'typeorm';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Ban } from './entities/ban.entity';

@Injectable()
export class BanService {

	constructor(
		@InjectRepository(Ban)
		private bansRepository: Repository<Ban>
	) {}


	async create(sessionId: number, roomData: Rooms, createBanDto: CreateBanDto) {

		// Get room owner ==> user_id != owner_id (you can't ban room's owner)
		if(roomData.admins.includes(sessionId))
			throw new HttpException({ message: 'You\'re not an admin of this room!' }, HttpStatus.UNAUTHORIZED);

		if(createBanDto.user_id == roomData.owner_id)
			throw new HttpException({ message: 'You can\'t ban the room crater!' }, HttpStatus.UNAUTHORIZED);

		// console.log(`room id is ${createBanDto.room_id} user id ${createBanDto.user_id}`);
		const bannedUser = await this.findUserInRoom(createBanDto.room_id, createBanDto.user_id);
		
		if( bannedUser )
		{
			bannedUser.created = Date.now();
			bannedUser.banned = createBanDto.banned;
			bannedUser.duration = createBanDto.duration;
			
			return this.bansRepository.save(bannedUser);
		}
		{
			const newBannedUser = this.bansRepository.create(createBanDto); // or create({ ....my data });
		
			const data = await this.bansRepository.save(newBannedUser); // insert Or update if it already exists
	
			return data;
		}
		
		
		
	}

	findAll() {
		return this.bansRepository.find();
	}

	async roomBannedList(roomId: number) {
		// TODO : baned list : should include ids of all banned users of this room + muted list of this room that expired (created + banned.duration > date.now())


		let bannedUsersIds: number[] = [];

		const bannedUsers = await getConnection().query(`
			SELECT *  FROM
				public."ban"
				WHERE public."ban".room_id = ${roomId};
		`);

		for (let i = 0; i < bannedUsers.length; i++) {
			if( bannedUsers[i].banned == true)
				bannedUsersIds.push(bannedUsers[i].user_id)
			else if ( (parseInt(bannedUsers[i].created) + (parseInt(bannedUsers[i].duration) * 1000)) > Date.now() )
			{
				bannedUsersIds.push(bannedUsers[i].user_id)
			}
		}

		return bannedUsersIds;		
	}


	async findUserInRoom(roomId: number, userId: number) {

		const data = await this.bansRepository.findOne({
			room_id: roomId,
			user_id: userId,
		});
		
		// when i reques http://localhost:8080/ban data returnd is undefind i have checked room id and user id both are correct 

		// if (!data)
		// 	throw new HttpException({ error: 'User Not Found' }, HttpStatus.NOT_FOUND);

		return data;
	}

	async update(sessionId: number, roomData: Rooms, updateBanDto: UpdateBanDto) {

		if(roomData.admins.includes(sessionId))
			throw new HttpException({ message: 'You\'re not an admin of this room!' }, HttpStatus.UNAUTHORIZED);

		if(updateBanDto.user_id == roomData.owner_id)
			throw new HttpException({ message: 'You can\'t ban the room crater' }, HttpStatus.UNAUTHORIZED);

		const bannedUser = await this.findUserInRoom(updateBanDto.room_id, updateBanDto.user_id);

		if( bannedUser )
		{
			bannedUser.created = Date.now();
			bannedUser.banned = updateBanDto.banned;
			bannedUser.duration = updateBanDto.duration;
			
			return this.bansRepository.save(bannedUser);
		}
		{
			throw new HttpException({ error: "Couldn't update, please try again later!" }, HttpStatus.NOT_MODIFIED);
		}
	}

	async unbanUserFromRoom(sessionId: number, roomData: Rooms , roomId: number, userId: number) {
		
		if(roomData.admins.includes(sessionId))
			throw new HttpException({ message: 'You\'re not an admin of this room!' }, HttpStatus.UNAUTHORIZED);

		const unBannedUser = await this.findUserInRoom(roomId, userId);
		if(unBannedUser)
		{
			return this.bansRepository.remove(unBannedUser);
		}
		else
		{
			throw new HttpException({ error: "Couldn't update, please try again later!" }, HttpStatus.NOT_MODIFIED);
		}
	}
}
