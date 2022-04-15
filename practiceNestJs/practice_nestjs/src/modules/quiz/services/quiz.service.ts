import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateQuizDto } from "../dto/createQuiz.dto";
import { Quiz } from "../entities/quiz.entity";
import { QuizRepository } from "../repositories/quiz.repository";

@Injectable()
export class QuizService {
    constructor(@InjectRepository(QuizRepository) private quizRepository: QuizRepository) {}
    
    async createQuiz(quiz: CreateQuizDto) : Promise<Quiz>
    {
        return await this.quizRepository.save(quiz);
    }

    async getQuizById(id: number ) : Promise<Quiz>
    {
        return await this.quizRepository.findOne(id, {relations: ['questions']});
    }

}