import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
	constructor(private readonly quizService: QuestionService) {}

	@Post('')
	@UsePipes(ValidationPipe)
	async createQuestion(@Body() questionData: CreateQuestionDto) : Promise<Question>
	{
		return await this.quizService.createQuestion(questionData);
	}
}