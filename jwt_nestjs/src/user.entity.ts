import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity
{
    @PrimaryColumn()
    id: number;
    

    @Column({ type: 'varchar', nullable: true})
    email: string;
    
    @Column({ type: 'varchar', nullable: true})
    login: string;

    @Column({ type: 'varchar', nullable: true})
    image_url: string;

    @Column({ type: 'boolean', nullable: true})
    twof: boolean = false;
}