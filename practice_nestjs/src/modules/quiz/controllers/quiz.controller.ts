import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { QuestionService } from './question.service';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get('/:id')
	async getQuizById(@Param('id', ParseIntPipe) id: number) : Promise<Quiz>
	{
		return await this.quizService.getQuizById(id);
	}

	
	@Post('/create')
	@UsePipes(ValidationPipe)
	async createQuiz(@Body() quizData: CreateQuizDto) : Promise<Quiz>
	{
		return await this.quizService.createQuiz(quizData);
	}
}