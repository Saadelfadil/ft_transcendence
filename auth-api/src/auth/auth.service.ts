import { Injectable } from '@nestjs/common';
import { User, UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    async validateUser(username: string, password: string) : Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user && user.password === password)
        {
            return `The user is ${user.name}`;
        }
        return null;
    };
}
