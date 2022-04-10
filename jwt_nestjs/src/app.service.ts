import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Authenticator from './42-authentication';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AppService {
		constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>, private readonly jwtService: JwtService) {}

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

		async authentication(code: string, response: Response)
		{
			// you can see the attached screen shot to know where get this variables
			const UID          = "3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7";
			const SECRET       = "db46d9e4b515ce133284553f8981ed558b8873bf35744006f143f0101d8e3c89";
			const REDIRECT_URI = "http://localhost:3000/api/";

			// 42 authenticator instance
			var appp = new Authenticator(UID, SECRET, REDIRECT_URI);

			// after send the user to 42 site to authorize the app [example of 42 site: https://api.intra.42.fr/oauth/authorize?client_id=98a139f98b077445f8e84de4cb23e7668fb010a01b9c0ed20b8a4&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code]
			// 42 redirect the user to the REDIRECT_URI (in this example is: http://localhost:3000) with the code in query string
			// like that: http://localhost:3000/?code=7a0cb1a9c5b0fd31a0eb9c5f854fc2386b1edc2179f73c76904d65f5aae4e9bc
			// get the code from the query string (code=7a0cb1a9c5b0fd31a0eb9c5f854fc2386b1edc2179f73c76904d65f5aae4e9bc)
			// and give it to get_Access_token function like below
			var token = appp.get_Access_token(code);

			token.then(async (data) => {
				// get the acces token of the user
				// console.log("======================== auth user Data =========================");
				// console.log(data);
				// console.log("========================= 42 user data ==========================");
				// get the user info from 42 api
				const userData = await appp.get_user_data(data.access_token).then(async (data) => {
					return (data);
				});

				const { id, email, login, image_url } = userData;
				const userDb = await this.getUserById(id).then((ret) => {
					return ret;
				});

				console.log(`Heyy Iam Saad ID : ${id}, EMAIL : ${email}, LOGIN : ${login}, IMAGE_URL : ${image_url}`);
				console.log("=============================================================");
 
				return this.create(
					{
						id,
						email,
						login,
						image_url
					}
				);
				
			});
		}
}
