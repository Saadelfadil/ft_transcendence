import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar'})
    email: string;

    @Column({ type: 'varchar'})
    login: string;

    @Column({ type: 'varchar'})
    image_url: string;
}