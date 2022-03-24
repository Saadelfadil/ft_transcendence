import { IsNotEmpty, Length } from "class-validator";

export class CreateQuestionDto
{
    @IsNotEmpty({message: 'You should write a question'})
    @Length(3, 30)
    question: string;
}