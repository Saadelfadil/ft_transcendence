import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
export declare class AuthenticatedGuard implements CanActivate {
    private jwtService;
    private appService;
    constructor(jwtService: JwtService, appService: AppService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
