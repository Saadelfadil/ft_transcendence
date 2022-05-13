"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    create(sessionId, createMessageDto) {
        let newMessage = this.messageRepository.create(createMessageDto);
        newMessage.from_id = sessionId;
        return this.messageRepository.save(newMessage);
    }
    async findOne(sessionId, userId) {
        return (0, typeorm_2.getConnection)().query(`
			SELECT public."message".*, public."users".username, public."users".id, public."users".image_url  FROM
				public."message"
				INNER JOIN
					public."users"
						ON public."message".from_id = public."users".id
				WHERE public."message".from_id = ${userId} AND public."message".to_id = ${sessionId}
				OR public."message".from_id = ${sessionId} AND public."message".to_id = ${userId}
				ORDER BY
					created ASC
				`);
    }
    async getChatList(sessionId) {
        return (0, typeorm_2.getConnection)().query(`
			SELECT * FROM
				public."message"
					INNER JOIN
							public."users"
						ON
							( public."message".from_id = public."users".id AND public."message".from_id != ${sessionId} )
						OR 
							( public."message".to_id = public."users".id AND public."message".to_id != ${sessionId} )
					INNER JOIN 
							(
								SELECT user_id, max(created) m FROM
								(
									SELECT id, to_id user_id, created FROM
											public."message"
										WHERE from_id = ${sessionId}
									UNION
										SELECT id, from_id user_id, created FROM
											public."message"
										WHERE
											to_id = ${sessionId}
								) t1
								GROUP BY user_id
							) t2
						ON
							( from_id = ${sessionId} AND to_id = user_id OR from_id = user_id AND to_id = ${sessionId} )  AND created = m
						ORDER BY
							created DESC
				`);
    }
    async remove(sessionId, userId) {
        return this.messageRepository.createQueryBuilder('message').delete()
            .where(new typeorm_2.Brackets(qb => {
            qb.where('from_id = :id', {
                id: userId,
            });
            qb.andWhere('to_id = :id2', {
                id2: sessionId,
            });
        }))
            .orWhere(new typeorm_2.Brackets(qb => {
            qb.where('to_id = :id3', {
                id3: userId,
            });
            qb.andWhere('from_id = :id4', {
                id4: sessionId,
            });
        }))
            .execute();
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map