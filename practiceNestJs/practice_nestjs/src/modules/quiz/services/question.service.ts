import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateQuestionDto } from "../dto/createQuestion.dto";
import { Question } from "../entities/question.entity";
import { Quiz } from "../entities/quiz.entity";
import { QuestionRepository } from "../repositories/question.repository";

@Injectable()
export class QuestionService {
    constructor(@InjectRepository(QuestionRepository) private questionRepository: QuestionRepository) {}
    async createQuestion(question: CreateQuestionDto, quiz: Quiz) : Promise<Question>
    {
        const newQuestion =  await this.questionRepository.save({
            question: question.question
        });
        // console.log(quiz);
        quiz.questions = [...quiz.questions, newQuestion];
        await quiz.save();
        return newQuestion;
    }
}