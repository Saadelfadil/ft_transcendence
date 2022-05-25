import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockService {

	constructor(
		@InjectRepository(Block)
		private blocksRepository: Repository<Block>,
	) {}


	arrayRemove(users: number[], userId: number) { 
        return users.filter(function(ele){ 
            return ele != userId; 
        });
    }

	findUser(userId: number) {
		return this.blocksRepository.findOne({
			user_id: userId,
		});
	}

	async blockUser(sessionId: number, createBlockDto: CreateBlockDto) {
		const userData = await this.findUser(sessionId);
		if( userData )
		{
			if( !userData.blocked.includes(createBlockDto.blocked) )
				userData.blocked.push(createBlockDto.blocked);
			return this.blocksRepository.save(userData);
		}
		else
		{

			let newUserData = this.blocksRepository.create();
			newUserData.user_id = sessionId;
			newUserData.blocked = [createBlockDto.blocked];
			return this.blocksRepository.save(newUserData);
		}
	}

	async unBlockUser(sessionId: number, createBlockDto: CreateBlockDto) {
		const userData = await this.findUser(sessionId);
		if( userData )
			userData.blocked = this.arrayRemove(userData.blocked, createBlockDto.blocked);
	
		return this.blocksRepository.save(userData);
	}

	async blockedList(sessionId: number) {

		const data = await getConnection().query(`
			SELECT public."users".*  FROM
				public."block"
				JOIN
						public."users"
					ON
						public."users".id = ANY(public."block".blocked)
				WHERE public."block".user_id = ${sessionId}
		`);

		return data.map(a => a.id);
	}

	async blockedListUsers(sessionId: number) {
		const data =  await this.blocksRepository.findOne({user_id : sessionId});
		if (data)
			return data.blocked;
		return [];
	}
	

	

	async isBlocked(sessionId: number, userId: number) {
		const userData = await this.findUser(sessionId);
		if( userData && userData.blocked.includes(userId) )
			return {'blocked': true};
		else
			return {'blocked': false};
	}
}
