import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class UserDto
{
    @IsNotEmpty({ message: "Should have an ID"})
    id: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 8)
    login: string;
    
    @IsNotEmpty()
    @Length(50)
    image_url: string;
}