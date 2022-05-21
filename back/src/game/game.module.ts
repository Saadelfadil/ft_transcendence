import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameLogic } from './game.logic';
import { MatchUpGateway } from './matchup/game.matchup.gateway';
import { MatchUpLogic } from './matchup/game.matchup.logic';
import { WarmUpLogic } from './warmup/game.warmup.logic';
import { WarmUpGateway } from './warmup/game.warmup.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository, MatchRepository } from './game.repository';
import { UserEntity } from 'src/users/user.entity';
import { LevelUpGateway } from './levelup/game.levelup.gateway';
import { LevelUpLogic } from './levelup/game.levelup.logic';
import { oneVoneGateway } from './1v1/game.1v1.gateway';
import { oneVoneLogic } from './1v1/game.1v1.logic';

@Module({
  imports: [TypeOrmModule.forFeature([GameRepository,
                                      MatchRepository,
                                      UserEntity])],
  controllers: [GameController],
  providers: [GameService,
              GameGateway,
              GameLogic,
              MatchUpGateway,
              MatchUpLogic,
              WarmUpLogic,
              WarmUpGateway,
              LevelUpGateway,
              LevelUpLogic,
              oneVoneGateway,
              oneVoneLogic
            ]
})
export class GameModule {}
