import { Body, Controller, Get, NotFoundException, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import Authenticator from './42-authentication';
import { AuthenticatedGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
const speakeasy = require('speakeasy');

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService) { }


	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req)
	{

	}

	@Get('auth/google/callback')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req)
	{
		return this.appService.googleLogin(req);
	}

	@UseGuards(AuthenticatedGuard)
	@Get('profile')
	profile(@Req() request: Request) {
		return this.appService.getUserDataFromJwt(request);
	}

	@UseGuards(AuthenticatedGuard)
	@Get('game')
	game() {
		return "Hello to game route";
	}

	@UseGuards(AuthenticatedGuard)
	@Get('islogin')
	loginOrNot(@Req() request: Request) {
		const user = this.appService.getUserDataFromJwt(request);
		if (user)
			return true;
		return false;
	}

	@UseGuards(AuthenticatedGuard)
	@Post('update')
	updateU(@Req() request: Request, @Body() body) {
		return this.appService.updateUser(request, body);
	}

	@UseGuards(AuthenticatedGuard)
	@Post('verify')
	async verify(@Req() request: Request, @Body() body) {
		try {
			const {token} = request.body; 
			const cookie = request.cookies['jwt'];
			const data = await this.jwtService.verifyAsync(cookie);

			if (!data)
				throw new UnauthorizedException();
			const user = this.appService.getUserById(data['id']);
			
			const verified = speakeasy.totp.verify({
				secret: (await user).twof_secret,
				encoding: 'base32',
				token
			  });
			
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Post('validate')
	async validate(@Req() request: Request)
	{
		try {
			const {twof_qrcode} = request.body;
			const cookie = request.cookies['jwt'];
			const data = await this.jwtService.verifyAsync(cookie);

			if (!data)
				throw new UnauthorizedException();
			const user = this.appService.getUserById(data['id']);
			
			const tokenValidate = speakeasy.totp.verify({
				secret: (await user).twof_secret,
				encoding: 'base32',
				token: twof_qrcode,
				window:1 // time window
			  });

			if (tokenValidate)
				return true;
			return false;
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	@Post('login')
	async getData(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
		console.log("Code: ", code);
		const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
		const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
		const REDIRECT_URI = "http://localhost:8080/login";

		// 42 authenticator instance
		var appp = new Authenticator(UID, SECRET, REDIRECT_URI);

		var token = await appp.get_Access_token(code);

		const userData = await appp.get_user_data(token.access_token);

		const { id, email, login, image_url } = userData;
		const userDb = await this.appService.getUserById(id)
		
		console.log(`Heyy Iam Saad ID : ${id}, EMAIL : ${email}, LOGIN : ${login}, IMAGE_URL : ${image_url}`);
		console.log("=============================================================");
		
		if (!userDb) {
			let twof_secret = speakeasy.generateSecret();
			let twof_qrcode;
			twof_secret = twof_secret.base32;
			twof_qrcode = await this.appService.generateQR(twof_secret);
			twof_qrcode = await this.appService.uploadImage(twof_qrcode);
			console.log("My secret QRCODE : ", twof_qrcode);
			console.log("My secret key : ", twof_secret);
			const twof = false;

			this.appService.create(
				{
					id,
					email,
					login,
					image_url,
					twof,
					twof_secret,
					twof_qrcode
				}
			);
		}
		if (userData.error === undefined)
		{
			const jwt = await this.jwtService.signAsync({ id: id });
			response.cookie('jwt', jwt, { httpOnly: true });
			return jwt;
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Get('user')
	async user(@Req() request: Request) {
		try {
			const cookie = request.cookies['jwt'];
			const data = await this.jwtService.verifyAsync(cookie);

			if (!data)
				throw new UnauthorizedException();
			const user = this.appService.getUserById(data['id']);
			return user;
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');
		return "Cookies Clean";
	}

}
