import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockService } from 'src/chat/block/block.service';
import { Brackets, getConnection, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,

		
	) {}
		
	create(sessionId: number, createMessageDto: CreateMessageDto) {

		let newMessage = this.messageRepository.create(createMessageDto);
		newMessage.from_id = sessionId;

		return this.messageRepository.save(newMessage);
	}


	async findOne(sessionId: number, userId: number) {

		return getConnection().query(`
			SELECT public."message".*, public."users".username, public."users".id, public."users".avatar  FROM
				public."message"
				INNER JOIN
					public."users"
						ON public."message".from_id = public."users".id
				WHERE public."message".from_id = ${userId} AND public."message".to_id = ${sessionId}
				OR public."message".from_id = ${sessionId} AND public."message".to_id = ${userId}
				ORDER BY
					created ASC
				`);

				/*
				
				
				
				*/

			// 	INNER JOIN
			// 	public."users"
			// ON
			// 	( public."message".from_id = public."users".id AND public."message".from_id != ${sessionId} )
			// 	OR 
			// 	( public."message".to_id = public."users".id AND public."message".to_id != ${sessionId} )




		// return this.messageRepository.createQueryBuilder('message')
		// 	.where(new Brackets(qb => {
		// 		qb.where('from_id = :id', {
		// 			id: userId,
		// 		});
		// 		qb.andWhere('to_id = :id2', {
		// 			id2: sessionId,
		// 		});                               
		// 	}))
		// 	.orWhere(new Brackets(qb => {
		// 		qb.where('to_id = :id3', {
		// 			id3: userId,
		// 		});
		// 		qb.andWhere('from_id = :id4', {
		// 			id4: sessionId,
		// 		});                               
		// 	}))
		// 	.getMany();
	}

	async getChatList(sessionId: number) {
		return getConnection().query(`
			SELECT * FROM
				public."message"
					INNER JOIN
							public."users"
						ON
							( public."message".from_id = public."users".id AND public."message".from_id != ${sessionId} )
						OR 
							( public."message".to_id = public."users".id AND public."message".to_id != ${sessionId} )
					INNER JOIN 
							(
								SELECT user_id, max(created) m FROM
								(
									SELECT id, to_id user_id, created FROM
											public."message"
										WHERE from_id = ${sessionId}
									UNION
										SELECT id, from_id user_id, created FROM
											public."message"
										WHERE
											to_id = ${sessionId}
								) t1
								GROUP BY user_id
							) t2
						ON
							( from_id = ${sessionId} AND to_id = user_id OR from_id = user_id AND to_id = ${sessionId} )  AND created = m
						ORDER BY
							created DESC
				`);

	}

	async remove(sessionId: number, userId: number) {

		return this.messageRepository.createQueryBuilder('message').delete()
			.where(new Brackets(qb => {
				qb.where('from_id = :id', {
					id: userId,
				});
				qb.andWhere('to_id = :id2', {
					id2: sessionId,
				});                               
			}))
			.orWhere(new Brackets(qb => {
				qb.where('to_id = :id3', {
					id3: userId,
				});
				qb.andWhere('from_id = :id4', {
					id4: sessionId,
				});                               
			}))
			.execute();
	}


}
