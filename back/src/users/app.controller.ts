import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, Query, Redirect, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { Response, Request, request } from 'express';
import Authenticator from './42-authentication';
import { AuthenticatedGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Index, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';
import { match } from 'assert';
import { use } from 'passport';
import { join } from 'path';
const speakeasy = require('speakeasy');

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService, private readonly jwtService: JwtService,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(UserFriendsEntity) private readonly userFriendsEntity: Repository<UserFriendsEntity>,
		@InjectRepository(UserGameEntity) private readonly userGameEntity: Repository<UserGameEntity>,
		@InjectRepository(UserHistoryEntity) private readonly userHistoryEntity: Repository<UserHistoryEntity>) { }

	@Post('getrequests')
	async getRequests(@Body() body, @Req() request: Request)
	{
		let reqs : Array<any> = [];
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		const user = await this.appService.getUserByIdFriend(userJwt.id);
		await Promise.all(user.user_requested.map(async (index) => {
			const { login } = await this.appService.getUserById(index);
			reqs.push({ id: index, login: login });
		}));
		return reqs;
	}

	@Post('getfriends')
	async getFriends(@Body() body, @Req() request: Request)
	{
		let reqs : Array<any> = [];
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		const user = await  this.appService.getUserByIdFriend(userJwt.id);
		await Promise.all(user.user_friends.map(async (index) => {
			const { login } = await this.appService.getUserById(index);
			reqs.push({ id: index, login: login });
		}));
		return reqs;
	}

	@Post('addfriend')
	async addFriend(@Body() body, @Req() request: Request)
	{
		const { login } = body;
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		let tmp : boolean = false;
		try {
			const { id } = await this.appService.getUserByLogin(login);
			const { user_requested, user_friends } = await this.appService.getUserByIdFriend(id);
			if (id === userJwt.id)
				return false;
			user_friends.map((curId: number) => {
				if (curId === userJwt.id)
				{
					tmp = true;
					return;
				}
			});
			if (tmp)
				return true;
			tmp = false;
			user_requested.map((curId: number) => {
				if (curId === userJwt.id)
				{
					tmp = true;
					return;
				}
			});
			if (!tmp)
			{
				user_requested.push(userJwt.id);
				await this.userFriendsEntity.update(id, {user_requested: user_requested});
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	@Post('removefriend')
	async removeFriend(@Body() body, @Req() request: Request)
	{
		const { friend_id } = body;
		if (friend_id == undefined)
			return ;
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		try {
			const userFriend = await this.appService.getUserByIdFriend(userJwt.id);
			const { user_friends } = await this.appService.getUserByIdFriend(friend_id);
			userFriend.user_friends.map((curId: number, index) => {
				if (curId === friend_id)
				{
					userFriend.user_friends.splice(index, 1);
					return;
				}
			});
			user_friends.map((curId: number, index) => {
				if (curId === userJwt.id)
				{
					user_friends.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(userJwt.id, {user_friends: userFriend.user_friends});
			await this.userFriendsEntity.update(friend_id, {user_friends: user_friends});
		} catch (error) {
		} 
	}
	
	@Post('requesttofriend')
	async RequestToFriend(@Body() body, @Req() request: Request)
	{
		const { is_accept, request_user_id } : {is_accept: boolean, user_id: number, request_user_id: number} = body;
		if (is_accept == undefined || request_user_id == undefined)
			return ;
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		if (is_accept)
		{
			const userFriendRequest = await this.appService.getUserByIdFriend(request_user_id);
			const { user_friends, user_requested } = await this.appService.getUserByIdFriend(userJwt.id);

			user_friends.push(request_user_id);
			userFriendRequest.user_friends.push(userJwt.id);
			user_requested.map((id: number, index) => {
				if (id === request_user_id)
				{
					user_requested.splice(index, 1);
					return;
				}
			});
			userFriendRequest.user_requested.map((id: number, index) => {
				if (id === userJwt.id)
				{
					userFriendRequest.user_requested.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(userJwt.id, {user_friends: user_friends, user_requested: user_requested});		
			await this.userFriendsEntity.update(request_user_id, {user_friends: userFriendRequest.user_friends, user_requested: userFriendRequest.user_requested});		
		}
		else
		{
			const { user_requested } = await this.appService.getUserByIdFriend(userJwt.id);
			user_requested.map((id: number, index) => {
				if (id === request_user_id)
				{
					user_requested.splice(index, 1);
					return;
				}
			});
			await this.userFriendsEntity.update(userJwt.id, {user_requested: user_requested});
		}
	}


	// @UseGuards(AuthenticatedGuard)
	@Get('islogin')
	async loginOrNot(@Req() request: Request) {
		try {
			const user = await this.appService.getUserDataFromJwt(request);
			return {is_login_db: user.is_login, id: user.id, image_url: user.image_url, login: user.login, status:true, twof:user.twof};
		} catch (error) {
			return {status:false};
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
	@Post('amijoinedtoroom')
	async amIJoinedToThisRoom(@Req() request: Request, @Body() body)
	{
		const user = await this.appService.getUserDataFromJwt(request);
		const {joinedRooms} = await this.appService.getUserById(user.id);
		if (body.room_id){
			let status:boolean = joinedRooms.includes(body.room_id);
			return {status:status};
		}
		return {status: false};
	}
	
	// @UseGuards(AuthenticatedGuard)
	// @Post('verify')
	// async verify(@Req() request: Request, @Body() body) {
	// 	try {
	// 		const {token} = request.body; 
	// 		const cookie = request.cookies['jwt'];
	// 		const data = await this.jwtService.verifyAsync(cookie);

	// 		if (!data)
	// 			throw new UnauthorizedException();
	// 		const user = this.appService.getUserById(data['id']);
			
	// 		const verified = speakeasy.totp.verify({
	// 			secret: (await user).twof_secret,
	// 			encoding: 'base32',
	// 			token
	// 		  });
			
	// 	} catch (error) {
	// 		throw new UnauthorizedException();
	// 	}
	// }

	@UseGuards(AuthenticatedGuard)
	@Post('validate')
	async validate(@Req() request: Request)
	{
		try {
			const { twof_qrcode, change, twof } = request.body;
			if (twof_qrcode == undefined || change == undefined || twof == undefined)
				return ;
			const cookie = request.cookies['jwt'];
			const data = await this.jwtService.verifyAsync(cookie);

			if (!data)
				return ;
			const user = await this.appService.getUserById(data['id']);
			
			const tokenValidate = speakeasy.totp.verify({
				secret: user.twof_secret,
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
			return ;
		}
	}

	@Post('getgamestatus')
	async getgamestate(@Body() body, @Req() request: Request){
		const userJwt = await this.appService.getUserDataFromJwt(request);
		if (userJwt.id == undefined)
			return;
		const gameStatus = await this.appService.getUserById(userJwt.id);
		const { in_game } = gameStatus;
		return { in_game : in_game };
		// await this.userRepository.update(user_id, {in_game: state});
	}


	@Post('login')
	async getData(@Body('code') code: string, @Res({ passthrough: true }) response: Response) {
		const UID = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
		const SECRET = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
		const REDIRECT_URI = `http://${process.env.HOST_IP}:8080/login`;
		// 42 authenticator instance
		console.log(code);
		var appp = new Authenticator(UID, SECRET, REDIRECT_URI);

		var token = await appp.get_Access_token(code);
		if (token == undefined)
			return;
		const userData = await appp.get_user_data(token.access_token);
		if (userData == undefined)
				return;
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
					twof_qrcode,
					joinedRooms: []
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
		if (id != undefined)
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
			if (user == undefined)
				return;
			user.wins = user.wins;
			user.loses = user.loss;
			return user;
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Post('getusers')
	async allUser(@Body() body) {
		let match : {
			left_player: {
				id:number;
				login:string;
				image_url:string;
			},
			right_player: {
				id:number;
				login:string;
				image_url:string;
			}
		};

		let users : Array<typeof match> = [];

		const { usersId } = body;

		if (usersId == undefined)
			return users;
		let tmp:any;
		const length = usersId.length;

		try{
			for (let i = 0; i < length; i +=  2)
			{
				const user = await this.appService.getUserById(usersId[i]);
				if (user == undefined)
					return;
				const { id, login, image_url } = user;
				tmp =  await this.appService.getUserById(usersId[i + 1]);
				if (tmp == undefined)
					return;
				users.push({left_player: {id:id, login:login, image_url:image_url}, right_player:  {id:tmp.id, login: tmp.login, image_url: tmp.image_url}});
			}
		}catch(e)
		{
			return [];
		}

		return users;
	}


	@UseGuards(AuthenticatedGuard)
	@Post('listofusers')
	async retUsersList(@Body() body){
		let SingleUser : {
			login:string;
			id:number;
		}
		let users : Array<typeof SingleUser> = [];
		const {usersId} = body;
		if (usersId == undefined)
			return ;
		try{
			await Promise.all(
				usersId.map(async (user_id:any) =>{
					const { login, id } = await this.appService.getUserById(user_id);
					users.push({login:login, id:id});
				})
			);
		}catch(e)
		{
			return {users: []};
		}
		return {users:users};
	}

	@Get('users')
	async users(){
		const query = this.userRepository.createQueryBuilder('UserEntity');
        const matchs = await query.getMany();
		console.log(matchs);
        return matchs;
	}

	@UseGuards(AuthenticatedGuard)
	@Post('exactuser')
	async getExactUser(@Body() body, @Req() request: Request){

		let tmp = false;
		const {friend_id} = body;

		if (friend_id == undefined)
			return ;

		try{
			const userJwt = await this.appService.getUserDataFromJwt(request);
			if (userJwt.id == undefined)
				return;
	
			const {login, image_url,  wins, loss} = await this.appService.getUserById(friend_id);
	
			
			const { user_friends } = await this.appService.getUserByIdFriend(userJwt.id);
			
			user_friends.map((fr_id) => {
				if (fr_id === friend_id)
				{
					tmp = true;
					return ;
				}
			});
			if (!tmp){
				const { user_requested } = await this.appService.getUserByIdFriend(friend_id);
				if (user_requested !== undefined) {
					user_requested.map((fr_id) => {
						if (fr_id === userJwt.id)
						{
							tmp = true;
							return ;
						}
					});
				}
			}
			return {login:login, image_url:image_url, is_friend:tmp, wins:wins, loses:loss};
		}catch(e)
		{
			return {error: true};
		}
	}

	@UseGuards(AuthenticatedGuard)
	@Post('getloginbyid')
	async getloginbyid(@Body() body){
		const {id} = body;
		if (id) {
			const {login, image_url} = await this.appService.getUserById(id);
			return {login: login, image_url: image_url};
		}
		return {login: 'invalid', image_url: 'invalid'};
	}
	
	@UseGuards(AuthenticatedGuard)
	@Post('joinedRooms')
	async getUserJoindAndBlocked(@Body() body){
		const {id} = body;
		if (id){
			const {joinedRooms} = await this.appService.getUserById(id);
			return {joinedRooms: joinedRooms};
		}
	}

	@Post('userbylogin')
	async FindUserByLogin(@Body() body){
		const {login} = body;
		try{
			const { id } = await this.appService.getUserByLogin(login);
			return {status: true, id:id};
		}catch(e)
		{
			return {status: false, id:-1};
		}
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');
		return "Cookies Clean";
	}
}
