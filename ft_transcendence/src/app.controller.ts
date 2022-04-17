import { Body, Controller, Get, NotFoundException, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import Authenticator from './42-authentication';
import { AuthenticatedGuard } from './auth.guard';

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService) { }

	// @Get('login')
	// redirect(@Res() res) {
	// 	res.set({ "Access-Control-Allow-Origin": "*" })
	// 	res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2F&response_type=code")
	// }

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
	@Post('update')
	updateU(@Req() request: Request, @Body() body) {
		return this.appService.updateUser(request, body);
	}

	@Post('login')
	async getData(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
		console.log("Code: ", code);
		const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
		const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
		const REDIRECT_URI = "http://localhost:8080/profile";

		// 42 authenticator instance
		var appp = new Authenticator(UID, SECRET, REDIRECT_URI);

		var token = await appp.get_Access_token(code);

		const userData = await appp.get_user_data(token.access_token);

		const { id, email, login, image_url } = userData;
		const userDb = await this.appService.getUserById(id)

		console.log(`Heyy Iam Saad ID : ${id}, EMAIL : ${email}, LOGIN : ${login}, IMAGE_URL : ${image_url}`);
		console.log("=============================================================");

		if (!userDb) {
			this.appService.create(
				{
					id,
					email,
					login,
					image_url,
				}
			);
		}
		console.log(userData.error);
		if (userData.error === undefined)
		{
			const jwt = await this.jwtService.signAsync({ id: id });
			response.cookie('jwt', jwt, { httpOnly: true });
			return jwt;
		}
	}

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
