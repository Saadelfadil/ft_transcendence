import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../services/app.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private jwtService: JwtService, private appService: AppService) {}
    
    async canActivate(context: ExecutionContext)
    {
        try {
            const request = context.switchToHttp().getRequest();
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data)
                return false;
            const user = this.appService.getUserById(data['id']);
            return true;
        } catch (error) {
			throw new UnauthorizedException();
        }
    }
}
