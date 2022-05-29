import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class NotFoundInterceptor implements NestInterceptor {
    private errorMessage;
    constructor(errorMessage: string);
    intercept(context: ExecutionContext, stream$: CallHandler): Observable<any>;
}
