import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto
{
    @IsNotEmpty()
    id: number;

    @IsEmail()
    email?: string;

    login?: string;

    image_url?: string;
}