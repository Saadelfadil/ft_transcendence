import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateQuizDto } from "./dto/createQuiz.dto";
import { QuizRepository } from "./quiz.repository";

@Injectable()
export class QuizService {
    constructor(@InjectRepository(QuizRepository) private quizRepository: QuizRepository) {}
    getAllQuiz()
    {
        return [1, 3, 3, 7, "Hey Iam saad"];
    }
    
    async createQuiz(quiz: CreateQuizDto)
    {
        return await this.quizRepository.save(quiz);
    }
}