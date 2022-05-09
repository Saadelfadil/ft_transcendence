"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../src/entities/user.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'ft_transcendence',
    entities: [user_entity_1.UserEntity,],
    synchronize: true,
};
//# sourceMappingURL=typeorm.config.js.map