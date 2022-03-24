import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get('/')
	getAllQuiz()
	{
		return this.quizService.getAllQuiz();
	}

	@Post('/create')
	@UsePipes(ValidationPipe)
	createQuiz(@Body() quizData: CreateQuizDto)
	{
		return quizData;
	}
}