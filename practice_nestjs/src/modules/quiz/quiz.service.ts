import { Injectable } from "@nestjs/common";

@Injectable()
export class QuizService {
    getAllQuiz()
    {
        return [1, 3, 3, 7, "Hey Iam saad"];
    }
}