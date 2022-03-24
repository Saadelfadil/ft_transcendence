import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateQuizDto } from "./dto/createQuiz.dto";
import { Quiz } from "./quiz.entity";
import { QuizRepository } from "./quiz.repository";

@Injectable()
export class QuizService {
    constructor(@InjectRepository(QuizRepository) private quizRepository: QuizRepository) {}
    
    async createQuiz(quiz: CreateQuizDto) : Promise<Quiz>
    {
        return await this.quizRepository.save(quiz);
    }

}