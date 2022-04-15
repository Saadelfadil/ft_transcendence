import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";

@Entity('questions')
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
    })
    question: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @JoinColumn({name: 'quiz_id'})
    quiz: Quiz;
}