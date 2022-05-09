<template>
    <div>
    <div class="grid grid-cols-1 min-w-full border rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
                    <li>
                        <div class="px-6"
                            v-for="room in rooms" :key="room.id"
                        >
                        <div class="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                            <div class="ml-2" v-if="roomNameIsVisible(room)">
                                <div class="text-sm font-light" style="color: #2d00ff;">  {{ room.name }} </div>
                            </div>
                            <div class="ml-4" v-else>
                                <form @submit.prevent="joinPrivate(room)">
                                    <div id="roompass_id">
                                        <div class="relative text-gray-600">
                                            <input
                                            v-focus
                                            @blur="ignorePassword"
                                            @keyup="userIsTyping"
                                            @keypress="userIsTyping"
                                            autoComplete="true" type="password" name="serch" placeholder="Password" class="bg-white h-10 px-5 pr-20 rounded-full text-sm focus:outline-none"
                                            v-model="user_room_pass"
                                            :class="{'bg-pink-500' : invalid_pass}"
                                            >
                                        </div>
                                    </div>
                                </form>
                            </div>
                            </div>
                            <div>
                                <div 
                                class="rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out  mr-6 cursor-pointer"
                                :class="room.locked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'"
                                >


								<div v-if="isJoined(room.id)" @click="getRoomData(room.id, room.name)">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" style="float: left; margin-right: 8px;"  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
									</svg>
									<span>Chat</span>
								</div>


								<div v-else @click="joinToRoom(room.id, room.locked, room.name)" >
									<div v-if="!room.locked" >
										<svg  xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"  style="float: left; margin-right: 8px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
										</svg>
										<span>join</span>
									</div>
									
									<div v-else >
										<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"  style="float: left; margin-right: 8px;" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
										<span>join</span>
									</div>
								</div>


                                </div>
                            </div>
                        </div>

                        </div>

                    </li>
                </ul>
            </div>
        </div>
</template>


<script lang="ts">
// interface Room{
//     room_id : number; // i use this variable as index be carful
//     room_name: string;
//     is_locked: boolean;
// }

interface Room{
    id : number; // i use this variable as index be carful
    name: string;
    locked: boolean;
    owner_id: number;
    admins: number[];
}

import { defineComponent } from 'vue'
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import io from 'socket.io-client';

const globalComponent = defineComponent({
    name: 'PublicChatBlock',
    components:{
    },
    data()
    {
        return {
            invalid_pass: false as boolean,
            user_room_pass: '' as string,
            typing_room_id: -1 as number,    
			token: '' as String,
			userId: 0,
			username: '' as String,
			avatar: '' as String,
			joinedRooms: [] as Number[],        
        }
    },
	mounted() {
		if (localStorage.userId) {
			this.userId = localStorage.userId;
		}
		if (localStorage.token) {
			this.token = localStorage.token;
		}
		if (localStorage.avatar) {
			this.avatar = localStorage.avatar;
		}
		if (localStorage.username) {
			this.username = localStorage.username;
		}
		if (localStorage.joinedRooms) {
			this.joinedRooms = localStorage.joinedRooms;
		}
        this.getRooms();

  	},
    methods: {
        async getRooms()
        {
            try {

                const resp = await axios.get(
					`http://localhost:3000/api/v1/room`,
					{
						headers: { Authorization: `Bearer ${this.token}` }
					}
				);
                const data = resp.data;

                store.commit('updateRooms', data);
            }
			catch(e)
            {
                console.log(`while trying to get data for rooms ${e}`);
            }
        },
        joinToRoom(room_id:number, is_locked:boolean, room_name:string)
        {
            // probably this function shoould by async
            if (is_locked)
                this.joinToPrivateRoom(room_id);
            else
                joinTheRoom(this.userId, room_id, '', room_name);
        },
        joinToPrivateRoom(room_id:number)
        {
            this.typing_room_id = room_id; // responsible for input visibilty
        },
		async joinPrivate(room:Room)
        {
            const tmp_pass = this.user_room_pass.trim();
            if (tmp_pass.length !== 0)
            {
                // i will send password to backend to chek if password is correct
                // just for testing i'm assuming that password is correct so i will fill the store
                // and redirect him to chat messages block
                joinTheRoom(this.userId, room.id, tmp_pass, room.name);
            }else{
                this.invalid_pass = true;
            }
        },
        
        async getRoomData(room_id:number, room_name:string)
        {       
            // const resp = await axios.get(
			// 	`http://localhost:3000/api/v1/room/${room_id}/messages`,
			// 	{
			// 		headers: { Authorization: `Bearer ${store.getters.getUserToken}` }
			// 	}
			// );
            // const data = resp.data;
			// store.commit('setRoomId', room_id);
            // store.commit('updatePublicRoomMsgs', data);
            // now i will redirect him to chat block messages

			store.commit('setRoomId', room_id);




            router.push({name: 'chatpublicmsg', query: { roomId: room_id, room_name: room_name}});
        },
        userIsTyping(e:any)
        {
            if (e.keyCode !== 13)
                this.invalid_pass = false;
        },
        roomNameIsVisible(room:Room)
        {
            if (room.locked)
            {
                return (this.typing_room_id !== room.id);
            }
            return true;
        },
        ignorePassword()
        {
            this.typing_room_id = -1;
            this.user_room_pass = '';
        },
		isJoined(id:number)
		{
			return this.joinedRooms.includes(id);
		}
    },
    directives:
    {
        focus : {
            mounted(el) {
                el.focus();
            },
        }
    },
    computed: {
        rooms() : Array<Room>
        {
            return store.getters.getRooms;
        }
    }
})

export default globalComponent;


//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://


const socket = io("http://localhost:8000")
const joinTheRoom = (userId: number, roomId: number, password: string, room_name:string) => {
	socket.emit(
		'join-room',
		{ 
			data: {
				from: userId,
				roomName: roomId,
				password: password
			}
		},
		(response: any) => {
			// join-room callback
			if(response.status)
			{
				globalComponent.methods!.getRoomData(roomId, room_name);
			}
			else
			{
				console.log("Error joining the room"); // ok
			}
		}
	)
}


//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://
//:::::::::::::::::::::::::::::::::::::::::::::::::::://

</script>


<style scoped>
.hideScrollBar::-webkit-scrollbar {
    display: none;
}

.hideScrollBar
{
    -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>