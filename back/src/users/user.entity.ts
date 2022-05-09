import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;
    

    @Column({ type: 'varchar', nullable: true})
    email: string;
    
    @Column({ unique: true })
	username: string;
    
    @Column({ type: 'varchar', nullable: true})
    login: string;

    @Column({ type: 'varchar', nullable: true})
    image_url: string;

    @Column({ type: 'boolean', nullable: true})
    twof: boolean = false;

    @Column({ type: 'varchar', nullable: true})
    twof_secret: string;

    @Column({ type: 'varchar', nullable: true})
    twof_qrcode: string;

    @Column({ type: 'boolean', nullable: true})
    is_login: boolean = false;

    @Column({ type: 'boolean', nullable: true})
    in_game: boolean = false;

    @Column({ type: 'int', nullable: true})
    points: number = 0;

    @Column({ type: 'int', nullable: true})
    wins: number = 0;

    @Column({ type: 'int', nullable: true})
    loss: number = 0;

    @Column("int", { array: true })
	joinedRooms: number [] = [];
}