"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_controller_1 = require("./game.controller");
const game_service_1 = require("./game.service");
const game_gateway_1 = require("./game.gateway");
const game_logic_1 = require("./game.logic");
const game_matchup_gateway_1 = require("./matchup/game.matchup.gateway");
const game_matchup_logic_1 = require("./matchup/game.matchup.logic");
const game_warmup_logic_1 = require("./warmup/game.warmup.logic");
const game_warmup_gateway_1 = require("./warmup/game.warmup.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const game_repository_1 = require("./game.repository");
const user_entity_1 = require("../users/user.entity");
const game_levelup_gateway_1 = require("./levelup/game.levelup.gateway");
const game_levelup_logic_1 = require("./levelup/game.levelup.logic");
const game_1v1_gateway_1 = require("./1v1/game.1v1.gateway");
const game_1v1_logic_1 = require("./1v1/game.1v1.logic");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([game_repository_1.GameRepository,
                game_repository_1.MatchRepository,
                user_entity_1.UserEntity])],
        controllers: [game_controller_1.GameController],
        providers: [game_service_1.GameService,
            game_gateway_1.GameGateway,
            game_logic_1.GameLogic,
            game_matchup_gateway_1.MatchUpGateway,
            game_matchup_logic_1.MatchUpLogic,
            game_warmup_logic_1.WarmUpLogic,
            game_warmup_gateway_1.WarmUpGateway,
            game_levelup_gateway_1.LevelUpGateway,
            game_levelup_logic_1.LevelUpLogic,
            game_1v1_gateway_1.oneVoneGateway,
            game_1v1_logic_1.oneVoneLogic
        ]
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map