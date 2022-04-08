import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar'})
    email: string;

    @Column({ type: 'varchar'})
    login: string;

    @Column({ type: 'varchar'})
    image_url: string;
}