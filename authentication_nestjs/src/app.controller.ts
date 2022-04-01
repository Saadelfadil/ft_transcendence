import { Request, UseGuards } from '@nestjs/common';
import { Controller, Get, Post,  } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) : any {
    return req.user;
  }

  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
}
