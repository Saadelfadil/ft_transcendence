import { PassportSerializer } from "@nestjs/passport"
import { doesNotMatch } from "assert";
import { userInfo } from "os";
import { User, UsersService } from "src/users/users.service";

export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UsersService) { super(); }

    serializeUser(user: User, done: (err, user: User) => void) 
    {
        done(null, user);
    }

    async deserializeUser(user: User, done: (err, user: User) => void) : Promise<any>
    {
        done(null, user);
    }
}
