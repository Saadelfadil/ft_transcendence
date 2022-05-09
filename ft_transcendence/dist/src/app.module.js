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
const app_controller_1 = require("./controllers/app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./user.entity");
const config_1 = require("@nestjs/config");
const google_strategy_1 = require("./google.strategy");
const userFriends_entity_1 = require("./userFriends.entity");
const userGame_entity_1 = require("./userGame.entity");
const userHistory_entity_1 = require("./userHistory.entity");
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
                entities: [user_entity_1.UserEntity, userFriends_entity_1.UserFriendsEntity, userGame_entity_1.UserGameEntity, userHistory_entity_1.UserHistoryEntity],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, userFriends_entity_1.UserFriendsEntity, userGame_entity_1.UserGameEntity, userHistory_entity_1.UserHistoryEntity]),
            jwt_1.JwtModule.register({
                secret: 'secret',
                signOptions: { expiresIn: '3600s' }
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            })
        ],
        controllers: [app_controller_1.AppController],
        exports: [app_service_1.AppService],
        providers: [app_service_1.AppService, google_strategy_1.GoogleStrategy],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map