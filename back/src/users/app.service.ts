import { Get, HttpException, HttpStatus, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Response, Request } from 'express';
import cloudinary from '../utils/cloudinary';
import { UserFriendsEntity } from './userFriends.entity';
import { UserGameEntity } from './userGame.entity';
import { UserHistoryEntity } from './userHistory.entity';
const QRCode = require('qrcode');

@Injectable()
export class AppService {
		constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(UserFriendsEntity) private readonly  userFriendsEntity: Repository<UserFriendsEntity>,
		@InjectRepository(UserGameEntity) private readonly userGameEntity: Repository<UserGameEntity>,
		@InjectRepository(UserHistoryEntity) private readonly userHistoryEntity: Repository<UserHistoryEntity>,
		private readonly jwtService: JwtService) {}


		googleLogin(req)
		{
			if (!req.user)
				throw new NotFoundException();
			return {user: req.user};
		}

		async create(data: any) : Promise<UserEntity>
		{
			data.username = data.login;
			return this.userRepository.save(data);
		}

		async getUserByLogin(login: string) : Promise<UserEntity>
		{
			const user = await this.userRepository.findOne({login});
			return user;
		}

		async getUserById(id: number) : Promise<UserEntity>
		{
			const user = await this.userRepository.findOne(id).then((user) => {
				return user;
			});
			return user;
		}

		async getUserByIdFriend(id: number) : Promise<UserFriendsEntity>
		{
			const user = await this.userFriendsEntity.findOne(id).then((user) => {
				return user;
			});
			return user;
		}

		async getUserByIdGame(id: number) : Promise<UserGameEntity>
		{
			const user = await this.userGameEntity.findOne(id).then((user) => {
				return user;
			});
			return user;
		}

		async getUserByIdHistory(id: number) : Promise<UserHistoryEntity>
		{
			const user = await this.userHistoryEntity.findOne(id).then((user) => {
				return user;
			});
			return user;
		}

		async getUserDataFromJwt(request: Request) : Promise<UserEntity>
		{
			console.log('called');
			try {
				const cookie = request.cookies['jwt'];
				const data = await this.jwtService.verifyAsync(cookie);
				
				if (!data)
					throw new UnauthorizedException();
				const user = this.getUserById(data['id']);
				return user;
			} catch (error) {
				throw new UnauthorizedException();
			}
		}

		async generateQR(text: string)
		{
			try {
				// console.log(await QRCode.toDataURL([{account: "saad", key: text}]));
				// return QRCode.toDataURL([  {data : "Account: saad\n", mode: "byte"},
				return QRCode.toDataURL(text);
			} catch (error) {
				console.error(error);
			}
		}

		async uploadImage(twof_qrcode: string)
		{
			const fileStr = twof_qrcode;
			const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
				upload_preset: 'ft_transcendence'
			});
			return uploadedResponse.secure_url;
		}

		async updateUser(request: Request, body: any) : Promise<any>
		{
			const user = await this.getUserDataFromJwt(request);
			const userDb = await this.getUserByLogin(body.login);
			if (userDb)
				throw new UnauthorizedException();
			if ((body.login) != null){
				await this.userRepository.update(user.id, {login: body.login, username: body.login});
			}
			if (body.image_url != null)
			{
				try {
					const fileStr = body.image_url;
					const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
						upload_preset: 'ft_transcendence'
					})
					await this.userRepository.update(user.id, {image_url: uploadedResponse.secure_url});
					return {image_url: uploadedResponse.secure_url};
					
				} catch (error) {
					console.error(error);
				}
			}
		}

		// Laarbi Functions

		arrayRemove(joinedRooms: number[], roomId: number) { 
			return joinedRooms.filter(function(ele){ 
				return ele != roomId; 
			});
		}
		async findOne(id: number) {
			const data = await  this.userRepository.findOne(id);
			if (!data)
				throw new HttpException({ message: 'User Not Found' }, HttpStatus.NOT_FOUND);
			return data;
		}

		async joinRoom(id: number, roomId: number): Promise<boolean> {
			const userData = await this.findOne(id);
			if( userData && !userData.joinedRooms.includes(roomId))
			{
				userData.joinedRooms.push(roomId);
				// TODO: make new JWT that has joinedRooms = userData.joinedRooms 
				this.userRepository.save(userData);
				return true;
			}
			else
				return false
		}
	
		async leaveRoom(id: number, roomId: number): Promise<boolean> {
			const userData = await this.findOne(id);
			if( userData && userData.joinedRooms.includes(roomId) )
			{
				userData.joinedRooms = this.arrayRemove(userData.joinedRooms, roomId);
				this.userRepository.save(userData);
				return true;
			}
			return false;
		}

		

}
