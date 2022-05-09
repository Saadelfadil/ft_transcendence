import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../services/app.service';
import { Response, Request, request } from 'express';
import Authenticator from '../utils/42-authentication';
import { AuthenticatedGuard } from '../guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Index, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserFriendsEntity } from '../entities/userFriends.entity';
import { UserGameEntity } from '../entities/userGame.entity';
import { UserHistoryEntity } from '../entities/userHistory.entity';
const speakeasy = require('speakeasy');

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(UserFriendsEntity) private readonly userFriendsEntity: Repository<UserFriendsEntity>,
		@InjectRepository(UserGameEntity) private readonly userGameEntity: Repository<UserGameEntity>,
		@InjectRepository(UserHistoryEntity) private readonly userHistoryEntity: Repository<UserHistoryEntity>) { }

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
		const user = await  this.appService.getUserByIdFriend(id);
		await Promise.all(user.user_friends.map(async (index) => {
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
	@Post('removefriend')
	async removeFriend(@Body() body)
	{
		const { user_id, friend_id } = body;
		try {
			const userFriend = await this.appService.getUserByIdFriend(user_id);
			const { user_friends } = await this.appService.getUserByIdFriend(friend_id);
			userFriend.user_friends.map((curId: number, index) => {
				if (curId === friend_id)
				{
					userFriend.user_friends.splice(index, 1);
					return;
				}
			});
			user_friends.map((curId: number, index) => {
				if (curId === user_id)
				{
					user_friends.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(user_id, {user_friends: userFriend.user_friends});
			await this.userFriendsEntity.update(friend_id, {user_friends: user_friends});
		} catch (error) {
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
					userFriendRequest.user_requested.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(user_id, {user_friends: user_friends, user_requested: user_requested});		
			await this.userFriendsEntity.update(request_user_id, {user_friends: userFriendRequest.user_friends, user_requested: userFriendRequest.user_requested});		
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

	@UseGuards(AuthenticatedGuard)
	@Get('profile')
	profile(@Req() request: Request) {
		return this.appService.getUserDataFromJwt(request);
	}

	@UseGuards(AuthenticatedGuard)
	@Get('islogin')
	async loginOrNot(@Req() request: Request, @Query() query) {
		try {
			const user = await this.appService.getUserDataFromJwt(request);
			return {is_login_db: user.is_login, id: user.id};
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Post('update')
	async updateU(@Req() request: Request, @Body() body)
	{
		try {
			return this.appService.updateUser(request, body);
		} catch (error) {
			throw new NotFoundException();
		}
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
				{
					let tmp_store : any;
					let img_url: any;
					if (!twof)
					{
						let twof_secret = speakeasy.generateSecret();
						let twof_qrcode;
						tmp_store = twof_secret.base32;
						
						twof_secret = twof_secret.otpauth_url;
						twof_qrcode = await this.appService.generateQR(twof_secret);
						twof_qrcode = await this.appService.uploadImage(twof_qrcode);
						img_url = twof_qrcode;
						await this.userRepository.update(user.id, {twof: twof, twof_secret: tmp_store, twof_qrcode: twof_qrcode});
					}
					await this.userRepository.update(user.id, {twof: twof});
					if (!twof)
						return {success: true, twof_qrcode: img_url, twof_secret: tmp_store};
				}
				return {success: true};
			}
			return {sucess:false};
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
			return user;
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	// @UseGuards(AuthenticatedGuard)
	@Post('getusers')
	async allUser(@Body() body) {
		let users : Array<{id:number, login:string, image_url: string}> = [];

		const { usersId } = body;

		await Promise.all(usersId.map(async (index) => {
			const { id, login, image_url} = await this.appService.getUserById(index);
			users.push({id, login, image_url});
		}));
		return users;
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');
		return "Cookies Clean";
	}

}
