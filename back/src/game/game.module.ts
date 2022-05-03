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

@Module({
  imports: [TypeOrmModule.forFeature([GameRepository,
                                      MatchRepository])],
  controllers: [GameController],
  providers: [GameService,
              GameGateway,
              GameLogic,
              MatchUpGateway,
              MatchUpLogic,
              WarmUpLogic,
              WarmUpGateway
            ]
})
export class GameModule {}
