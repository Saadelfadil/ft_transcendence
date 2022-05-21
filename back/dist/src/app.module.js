"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const config_1 = require("@nestjs/config");
const userFriends_entity_1 = require("./users/userFriends.entity");
const userGame_entity_1 = require("./users/userGame.entity");
const userHistory_entity_1 = require("./users/userHistory.entity");
const game_module_1 = require("./game/game.module");
const messages_module_1 = require("./chat/messages/messages.module");
const room_module_1 = require("./chat/room/room.module");
const ban_module_1 = require("./chat/ban/ban.module");
const user_module_1 = require("./users/user.module");
const message_entity_1 = require("./chat/messages/entities/message.entity");
const ban_entity_1 = require("./chat/ban/entities/ban.entity");
const room_message_entity_1 = require("./chat/room/entities/room-message.entity");
const game_entities_1 = require("./game/game.entities");
const room_entity_1 = require("./chat/room/entities/room.entity");
const block_entity_1 = require("./chat/block/entities/block.entity");
const block_module_1 = require("./chat/block/block.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'admin',
                password: 'admin',
                database: 'ft_transcendence',
                entities: [user_entity_1.UserEntity, userFriends_entity_1.UserFriendsEntity, userGame_entity_1.UserGameEntity, userHistory_entity_1.UserHistoryEntity, game_entities_1.Room, game_entities_1.Match, message_entity_1.Message, ban_entity_1.Ban, block_entity_1.Block, room_message_entity_1.RoomMessage, room_entity_1.Rooms],
                synchronize: true,
            }),
            jwt_1.JwtModule.register({
                secret: 'secret',
                signOptions: { expiresIn: '3600s' }
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            game_module_1.GameModule,
            messages_module_1.MessagesModule,
            room_module_1.RoomModule,
            ban_module_1.BanModule,
            block_module_1.BlockModule,
            user_module_1.UserModule,
        ],
        controllers: [],
        exports: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map