"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanModule = void 0;
const common_1 = require("@nestjs/common");
const ban_service_1 = require("./ban.service");
const ban_controller_1 = require("./ban.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ban_entity_1 = require("./entities/ban.entity");
const room_module_1 = require("../room/room.module");
const jwt_module_1 = require("@nestjs/jwt/dist/jwt.module");
const user_module_1 = require("../../users/user.module");
let BanModule = class BanModule {
};
BanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ban_entity_1.Ban]), (0, common_1.forwardRef)(() => room_module_1.RoomModule),
            jwt_module_1.JwtModule.register({
                secret: 'secret',
                signOptions: { expiresIn: '3600s' }
            }), user_module_1.UserModule],
        controllers: [ban_controller_1.BanController],
        providers: [ban_service_1.BanService],
        exports: [ban_service_1.BanService]
    })
], BanModule);
exports.BanModule = BanModule;
//# sourceMappingURL=ban.module.js.map