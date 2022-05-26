"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const messages_controller_1 = require("./messages.controller");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("./entities/message.entity");
const block_module_1 = require("../block/block.module");
const messages_gateway_1 = require("./messages.gateway");
const jwt_module_1 = require("@nestjs/jwt/dist/jwt.module");
const user_module_1 = require("../../users/user.module");
let MessagesModule = class MessagesModule {
};
MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message]), block_module_1.BlockModule, jwt_module_1.JwtModule.register({
                secret: 'secret',
                signOptions: { expiresIn: '3600s' }
            }), user_module_1.UserModule],
        controllers: [messages_controller_1.MessagesController],
        providers: [messages_service_1.MessagesService, messages_gateway_1.MessageGateway]
    })
], MessagesModule);
exports.MessagesModule = MessagesModule;
//# sourceMappingURL=messages.module.js.map