
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ban {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('boolean', {default: false})
	banned: boolean;

	@Column()
	user_id: number;

	@Column()
	room_id: number;

 	@Column('bigint')
	created: number;

	@Column('int',  {default: '0'})
	duration: number;

}
