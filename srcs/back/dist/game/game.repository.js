"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = exports.MatchRepository = void 0;
const typeorm_1 = require("typeorm");
const game_entities_1 = require("./game.entities");
let MatchRepository = class MatchRepository extends typeorm_1.Repository {
    async addMatchData(data, type) {
        let newMatch = new game_entities_1.Match();
        newMatch.data = [];
        for (let i = 0; i < 2; i++) {
            let player = {};
            player.id = data.players[i];
            if (i === 0) {
                player.score = data.playerLeft.score;
            }
            else
                player.score = data.playerRight.score;
            newMatch.data.push(player);
        }
        newMatch.date = new Date();
        newMatch.playerLeft = data.players[0];
        newMatch.playerRight = data.players[1];
        newMatch.type = type;
        await newMatch.save();
    }
    async getAllMatchs() {
        const query = this.createQueryBuilder('match');
        const matchs = await query.getMany();
        return matchs;
    }
    async getMatchByUserId(id) {
        const query = this.createQueryBuilder('match').where('match.playerRight = :id OR match.playerLeft = :id', { id });
        const matchs = await query.getMany();
        return matchs;
    }
};
MatchRepository = __decorate([
    (0, typeorm_1.EntityRepository)(game_entities_1.Match)
], MatchRepository);
exports.MatchRepository = MatchRepository;
let GameRepository = class GameRepository extends typeorm_1.Repository {
    async addRoom(roomDb) {
        const room = new game_entities_1.Room();
        room.name = roomDb.name;
        room.players = roomDb.players;
        room.namespace = roomDb.namespace;
        await room.save();
    }
    async getAllRooms() {
        const query = this.createQueryBuilder('room');
        const rooms = await query.getMany();
        return rooms;
    }
    async deleteRoom(room) {
        this.delete({ name: room });
        return;
    }
};
GameRepository = __decorate([
    (0, typeorm_1.EntityRepository)(game_entities_1.Room)
], GameRepository);
exports.GameRepository = GameRepository;
//# sourceMappingURL=game.repository.js.map