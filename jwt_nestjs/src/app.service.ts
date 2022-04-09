import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

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
}
