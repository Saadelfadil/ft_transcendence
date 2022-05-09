import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Ban } from "src/chat/ban/entities/ban.entity";
import { Block } from "src/chat/block/entities/block.entity";
import { Message } from "src/chat/messages/entities/message.entity";
import { RoomMessage } from "src/chat/room/entities/room-message.entity";
import { Room } from "src/game/game.entities";
import { UserEntity } from "src/users/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'ft_transcendence',
    entities: [UserEntity, Message, Ban, Room, Block, RoomMessage],
    synchronize: true,
};