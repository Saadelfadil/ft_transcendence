import { Get, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Response, Request } from 'express';


@Injectable()
export class AppService {
		constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private readonly jwtService: JwtService) {}

		async create(data: any) : Promise<UserEntity>
		{
			return this.userRepository.save(data);
		}

		async getUserById(id: number) : Promise<UserEntity>
		{
			const user = await this.userRepository.findOne(id).then((user) => {
				return user;
			});
			return user;
		}

		async getUserDataFromJwt(request: Request) : Promise<any>
		{
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
}
