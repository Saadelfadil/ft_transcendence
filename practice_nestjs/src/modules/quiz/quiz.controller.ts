import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Post('/create')
	@UsePipes(ValidationPipe)
	async createQuiz(@Body() quizData: CreateQuizDto) : Promise<Quiz>
	{
		return await this.quizService.createQuiz(quizData);
	}
}