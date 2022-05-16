

import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	from_id: number;

	@Column()
	to_id: number;

	@Column()
	msg: string;

	@Column({default: false})
	isInvite: boolean;

	@Column({default: 0})
	inviteStatus: number;

 	@Column('bigint')
	created: number;


}
