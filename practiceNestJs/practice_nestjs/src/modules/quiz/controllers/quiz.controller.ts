import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuizDto } from '../dto/createQuiz.dto';
import { Quiz } from '../entities/quiz.entity';
import { QuizService } from '../services/quiz.service';

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get('/:id')
	async getQuizById(@Param('id', ParseIntPipe) id: number) : Promise<Quiz>
	{
		const quiz = await this.quizService.getQuizById(id);
		if (!quiz)
			throw "Id not found";
		return quiz;
	}

	
	@Post('/create')
	@UsePipes(ValidationPipe)
	async createQuiz(@Body() quizData: CreateQuizDto) : Promise<Quiz>
	{
		return await this.quizService.createQuiz(quizData);
	}
}