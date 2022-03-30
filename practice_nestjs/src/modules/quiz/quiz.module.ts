import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './controllers/question.controller';
import { QuestionRepository } from './repositories/question.repository';
import { QuestionService } from './question.service';
import { QuizController } from './quiz.controller';
import { QuizRepository } from './quiz.repository';
import { QuizService } from './services/quiz.service';

@Module({
    controllers: [QuizController, QuestionController],
    imports: [TypeOrmModule.forFeature([QuizRepository, QuestionRepository])],
    providers: [QuizService, QuestionService]
})
export class QuizModule {}
 