import { Body, Controller, Get, NotFoundException, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Response, Request, request } from 'express';
import Authenticator from './42-authentication';
import { AuthenticatedGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';
const speakeasy = require('speakeasy');

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(UserFriendsEntity) private readonly userFriendsEntity: Repository<UserFriendsEntity>,
		@InjectRepository(UserGameEntity) private readonly userGameEntity: Repository<UserGameEntity>,
		@InjectRepository(UserHistoryEntity) private readonly userHistoryEntity: Repository<UserHistoryEntity>) { }


	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req)
	{

	}

	@Post('getrequests')
	async getRequests(@Body() body)
	{
		let reqs : Array<any> = [];
		const { id } = body;
		const user = await this.appService.getUserByIdFriend(id);
		await Promise.all(user.user_requested.map(async (index) => {
			const { login } = await this.appService.getUserById(index);
			reqs.push({ id: index, login: login });
		}));
		return reqs;
	}

	@Post('getfriends')
	async getFriends(@Body() body)
	{
		let reqs : Array<any> = [];
		const { id } = body;
		const { user_friends } = await  this.appService.getUserByIdFriend(id);
		await Promise.all(user_friends.map(async (index) => {
			const { login } = await this.appService.getUserById(index);
			reqs.push({ id: index, login: login });
		}));
		return reqs;
	}

	@Post('addfriend')
	async addFriend(@Body() body)
	{
		const { login, user_id } = body;
		let tmp : boolean = false;
		try {
			const { id } = await this.appService.getUserByLogin(login);
			const { user_requested, user_friends } = await this.appService.getUserByIdFriend(id);
			if (id === user_id)
				return false;
			user_friends.map((curId: number) => {
				if (curId === user_id)
				{
					tmp = true;
					return;
				}
			});
			if (tmp)
				return true;
			tmp = false;
			user_requested.map((curId: number) => {
				if (curId === user_id)
				{
					tmp = true;
					return;
				}
			});
			if (!tmp)
			{
				user_requested.push(user_id);
				await this.userFriendsEntity.update(id, {user_requested: user_requested});
			}
			return true;
		} catch (error) {
			return false;
		}
	}
	
	
	@Post('requesttofriend')
	async RequestToFriend(@Body() body)
	{
		const { is_accept, user_id, request_user_id } : {is_accept: boolean, user_id: number, request_user_id: number} = body;

		if (is_accept)
		{
			const userFriendRequest = await this.appService.getUserByIdFriend(request_user_id);
			const { user_friends, user_requested } = await this.appService.getUserByIdFriend(user_id);

			user_friends.push(request_user_id);
			userFriendRequest.user_friends.push(user_id);
			user_requested.map((id: number, index) => {
				if (id === request_user_id)
				{
					user_requested.splice(index, 1);
					return;
				}
			});
			userFriendRequest.user_requested.map((id: number, index) => {
				if (id === user_id)
				{
					console.log("sghfkjsgfkjsbgfs");
					userFriendRequest.user_requested.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(user_id, {user_friends: user_friends, user_requested: user_requested});		
			await this.userFriendsEntity.update(request_user_id, {user_friends: userFriendRequest.user_friends});		
		}
		else
		{
			const { user_requested } = await this.appService.getUserByIdFriend(user_id);
			user_requested.map((id: number, index) => {
				if (id === request_user_id)
				{
					user_requested.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(user_id, {user_requested: user_requested});
		}
	}

	// Two Routes for User Friends
	@Post('array')
	async insertArray()
	{
		const userFriend = {
			"id": 62603,
			"user_friends": [],
			"user_blocked": [],
			"user_requested": [],
		}
		await this.userFriendsEntity.save(userFriend);
	}
	
	// Two Routes for User Friends
	// @Post('array1')
	// async insertArray1(@Body() body)
	// {
	// 	const { id, login } = body;
	// 	// const userFriend = {
	// 	// 	"id": 1337,
	// 	// 	"email": "melghoud@1337.ma",
	// 	// 	"login": "melghoud",
	// 	// 	"image_url": "DSfsdfsfsdf",
	// 	// }
	// 	await this.userRepository.save({id: id, login: login});
	// }

	// @Post('arrayupdate')
	// async updateArray()
	// {
	// 	const user = await  this.appService.getUserByIdFriend(100);
	// 	const userFriends  = user.user_friends;
	// 	userFriends.push(78880);
	// 	await this.userFriendsEntity.update(100, {user_friends: userFriends});
	// }

	// Two Routes for User Game
	// @Post('updategame')
	// async updateGame(@Body() body)
	// {
	// 	let {winOrlost, score, id} = body;
	// 	const user = await  this.appService.getUserByIdGame(id);
	// 	score += +user.score;
	// 	if (winOrlost)
	// 		await this.userGameEntity.update(id, {wins: +user.wins + 1, score: score});
	// 	await this.userGameEntity.update(id, {loses: +user.loses + 1, score: score});
	// }

	// Two Routes for User History
	// @Post('array')
	// async insertArray()
	// {
	// 	const userHistory = {
	// 		"id": 100,
	// 		"opponent": 99,
	// 		"user_score": 75,
	// 		"opponent_score": 50
	// 	}
	// 	await this.userHistoryEntity.save(userHistory);
	// }

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
	async loginOrNot(@Req() request: Request, @Query() query) {
		const user = await this.appService.getUserDataFromJwt(request);
		return {is_login_db: user.is_login, id: user.id};
	}

	@UseGuards(AuthenticatedGuard)
	@Post('update')
	async updateU(@Req() request: Request, @Body() body) {
		this.appService.updateUser(request, body);
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
			const { twof_qrcode, change, twof } = request.body;
			const cookie = request.cookies['jwt'];
			const data = await this.jwtService.verifyAsync(cookie);

			if (!data)
				throw new UnauthorizedException();
			const user = await this.appService.getUserById(data['id']);
			
			const tokenValidate = speakeasy.totp.verify({
				secret: (await user).twof_secret,
				encoding: 'base32',
				token: twof_qrcode,
				window: 1 // time window
			  });

			if (tokenValidate)
			{
				await this.userRepository.update(user.id, {is_login: false});
				if (!change)
					await this.userRepository.update(user.id, {twof: twof});
				return true;
			}
			return false;
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	@Post('login')
	async getData(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
		const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
		const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
		const REDIRECT_URI = "http://localhost:8080/login";

		// 42 authenticator instance
		var appp = new Authenticator(UID, SECRET, REDIRECT_URI);

		var token = await appp.get_Access_token(code);

		const userData = await appp.get_user_data(token.access_token);

		const { id, email, login, image_url } = userData;
		const userDb = await this.appService.getUserById(id);

		if (!userDb) {
			let twof_secret = speakeasy.generateSecret();
			let twof_qrcode;
			let tmp_store = twof_secret.base32;
			
			twof_secret = twof_secret.otpauth_url;
			twof_qrcode = await this.appService.generateQR(twof_secret);
			twof_qrcode = await this.appService.uploadImage(twof_qrcode);
			const twof = false;
			this.appService.create(
				{
					id,
					email,
					login,
					image_url,
					twof,
					twof_secret: tmp_store,
					twof_qrcode
				}
			);
			await this.userGameEntity.save({
				id,
				wins: 0,
				loses: 0,
				score: 0
			});
			await this.userFriendsEntity.save({
				id,
				user_friends: [],
				user_blocked: [],
				user_requested: []
			});
		}
		await this.userRepository.update(id, {is_login: true});
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
			const user :any = await this.appService.getUserById(data['id']); 
			const { wins, loses } = await this.appService.getUserByIdGame(data['id']);
			user.wins = wins;
			user.loses = loses;
			// return {"user": user, "wins": wins, "loses": loses};
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
