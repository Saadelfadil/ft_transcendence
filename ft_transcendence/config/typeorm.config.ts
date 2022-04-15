import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserEntity } from "src/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'ft_transcendence',
    entities: [UserEntity],
    synchronize: true,
};