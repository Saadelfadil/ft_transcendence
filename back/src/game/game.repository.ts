import { EntityRepository, Repository } from "typeorm";
import { Match, matchPlayerData, Room } from "./game.entities";
import { roomDb, roomNode } from "./game.interface";

@EntityRepository(Match)
export class MatchRepository extends Repository<Match> {
    
    async addMatchData(data: roomNode, type: string){
        let newMatch = new Match();
        newMatch.data = [];
        for (let i = 0; i < 2; i++){
            let player = {} as matchPlayerData;
            player.id = data.players[i];
            if (i === 0){
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

    async getAllMatchs(): Promise<Match[]>{
        const query = this.createQueryBuilder('match');
        const matchs = await query.getMany();
        return matchs;
    }

    async getMatchByUserId(id: string): Promise<Match[]>{
        const query = this.createQueryBuilder('match').where('match.playerRight = :id OR match.playerLeft = :id', {id});
        const matchs = await query.getMany();
        return matchs;
    }

}

@EntityRepository(Room)
export class GameRepository extends Repository<Room> {

    async addRoom(roomDb: roomDb){
        const room = new Room();
        room.name = roomDb.name;
        room.players = roomDb.players;
        room.namespace = roomDb.namespace;
        await room.save();
    }


    async getAllRooms(): Promise<Room[]>{
        const query = this.createQueryBuilder('room');
        const rooms = await query.getMany();
        //console.log(rooms);
        return rooms;
    }


    async deleteRoom(room: string): Promise<void> {
        this.delete({name: room});
        return;
    }
}