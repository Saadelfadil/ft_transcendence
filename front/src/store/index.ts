import { createStore } from 'vuex'
import axios from 'axios';
import { Socket } from 'engine.io-client';
interface message{
	id: number;
	room_id: number;
	from_id: number;
  to_id: number;
	username: string;
	image_url: string;
	msg: string;
	created: string;
  inviteStatus: number;
  isInvite: boolean;
}

interface PlayerHistory
{
  history_id: number; // this one it's just for view
  player_avatar_1: string;
  player_id_1: number;
  player_avatar_2: string;
  player_id_2: number;
  player_score_1: number;
  player_score_2: number;
}

interface Player{
  player_id: number; // this should be unique
  player_avatar: string; // maybe url maybe just name of file that is inside assets i'm testing with images that are inside assets
  player_score: number; 
}

interface Room{
    id : number; // i use this variable as index be carful
    name: string;
    locked: boolean;
    owner_id: number;
    admins: number[];

}


export default createStore({
  // strict: true,
  state: {
    chatPublicMsgs: [
    ] as Array<message>,
    rooms: [] as Array<Room>,
    beforeAuth2 : false as boolean,
    is_verify: false as boolean, // V
    onlineUsers: [] as Array<number>,
    inGameUsers: [] as Array<number>,
    MainAppSocket: '' as any,
    num: 0 as number,
  },
  getters: {
    get_main_app_socket(state:any){
      return state.MainAppSocket;
    },
    get_in_game_users(state:any){
      return state.inGameUsers;
    },
    get_online_users(state:any){
      return state.onlineUsers;
    },
    get_verify(state:any)
    {
      return state.is_verify;
    },
    get_prev_auth(state:any){
      return state.beforeAuth2;
    },
    get_auth2_enabled_DB(state:any){
      return state.auth2_enabled_DB;
    },
	  getRooms(state:any)
    {
      return state.rooms;
    },
    getMsgs(state:any)
    {
      return state.chatPublicMsgs;
    }
  },
  mutations: {
    remove_at(state:any, index:number){
      state.chatPublicMsgs.splice(index, 1);
    },
    set_in_game_users(state:any, ingameusers:Array<number>){
      state.inGameUsers = ingameusers;
    },
    set_number(state:any, n:number){
      console.log(`before ${state.num}`);
      state.num = n;
      console.log(`after ${state.num}`);
    },
    set_main_app_socket(state:any, socket:any){
      state.MainAppSocket = socket;
    },
    set_online_users(state:any, us:Array<number>){
      state.onlineUsers = us;
    },
    set_verify(state:any, val:boolean){
      state.is_verify = val;
    },
    set_prev_auth(state:any, val: boolean){
      state.beforeAuth2 = val;
    },
    set_auth2_enabled_DB(state:any, val: boolean){
      state.auth2_enabled_DB = val;
    },
	  setRoomId(state:any, id:number) {
		  state.currentRoomId = id;
	  },
    updateRooms(state:any, rooms:Array<Room>)
    {
      state.rooms = [];
      state.rooms = rooms;
    },
    addRoom(state:any, room:Room)
    {
      	state.rooms.push(room);
    },
    updateRoomAccess(state:any, newRoomState:{room_id:number, access:boolean}){
      // state.rooms[newRoomState.index].locked = newRoomState.access;
      state.rooms.map((room:Room, index:number) => {
        if (room.id === newRoomState.room_id)
        {
          state.rooms[index].locked = newRoomState.access;
          return ;
        }
      });
    },
    removeRoomWithId(state:any, room_id:number){
      state.rooms.map((room:Room, index:number) => {
        if (room.id === room_id)
        {
          state.rooms.splice(index, 1);
          return ;
        }
      });
    },
    updateChatState(state:any, index:number)
    {
      state.chatState.index = index;
    },
    updatePublicRoomMsgs(state:any, msgs:Array<any>)
    {
      state.chatPublicMsgs = [];
      state.chatPublicMsgs = msgs;
    },
    addMessageToRoomMsgs(state: any, msg:message)
    {
      for (let i = 0; i < state.chatPublicMsgs.length; ++i)
      {
        if (state.chatPublicMsgs[i].id === +msg.id)
        return ;
      }
      state.chatPublicMsgs.push(msg);
    },
  }
})

