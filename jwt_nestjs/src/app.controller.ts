import { Body, Controller, Get, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassThrough } from 'stream';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService) {}

	@Get('login')
	redirect(@Res() res)
	{
		return res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2F&response_type=code");
	}

	@Get('profile')
	profile()
	{
		return "Hello to my profile";
	}

	// @UsePipes(ValidationPipe)
	@Get()
	async getData(@Query('code') code: string, @Res({ passthrough: true }) response: Response)
	{
		const user = this.appService.authentication(code, response);
		const jwt = await this.jwtService.signAsync({id: user.id});
		response.cookie('jwt', jwt, {httpOnly: true});
	}
}
