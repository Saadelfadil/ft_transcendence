"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const ban_entity_1 = require("../src/chat/ban/entities/ban.entity");
const block_entity_1 = require("../src/chat/block/entities/block.entity");
const message_entity_1 = require("../src/chat/messages/entities/message.entity");
const room_message_entity_1 = require("../src/chat/room/entities/room-message.entity");
const game_entities_1 = require("../src/game/game.entities");
const user_entity_1 = require("../src/users/user.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'ft_transcendence',
    entities: [user_entity_1.UserEntity, message_entity_1.Message, ban_entity_1.Ban, game_entities_1.Room, block_entity_1.Block, room_message_entity_1.RoomMessage],
    synchronize: true,
};
//# sourceMappingURL=typeorm.config.js.map