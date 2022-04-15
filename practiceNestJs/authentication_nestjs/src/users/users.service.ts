import { Injectable } from '@nestjs/common';

export type User = {
    id: number;
    name: string;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            id: 1,
            name: 'saad',
            username: 'sel-fadi',
            password: '1337'
        },
        {
            id: 2,
            name: 'achraf',
            username: 'ael-fadi',
            password: '1337'
        }
    ];

    async findOne(username: string) : Promise<User | undefined>
    {
        return this.users.find((user) => user.username === username);
    }
}
