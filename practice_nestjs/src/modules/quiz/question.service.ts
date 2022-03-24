import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { Question } from "./question.entity";
import { QuestionRepository } from "./question.repository";

@Injectable()
export class QuestionService {
    constructor(@InjectRepository(QuestionRepository) private questionRepository: QuestionRepository) {}
    async createQuestion(question: CreateQuestionDto) : Promise<Question>
    {
        return await this.questionRepository.save(question);
    }
}