import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column("int", { array: true })
	blocked: number[];

}
