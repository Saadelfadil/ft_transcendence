import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { find, findIndex } from 'rxjs';
import { CreateQuestionDto } from '../dto/createQuestion.dto';
import { Question } from '../entities/question.entity';
import { QuestionService } from '../services/question.service';
import { QuizService } from '../services/quiz.service';

@Controller('question')
export class QuestionController {
	constructor(private readonly questionService: QuestionService, private quizService: QuizService) {}

	@Post('')
	@UsePipes(ValidationPipe)
	async createQuestion(@Body() questionData: CreateQuestionDto) : Promise<Question>
	{
		const newQuiz = await this.quizService.getQuizById(questionData.quiz_id);
		if (!newQuiz)
			throw "Id not found";
		// console.log(newQuiz);

		return await this.questionService.createQuestion(questionData, newQuiz);
	}
}