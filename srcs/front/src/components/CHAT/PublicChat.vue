<template>
    <div>
        <div class="grid grid-cols-1 min-w-full border rounded">
            <ul class="overflow-auto hideScrollBar" style="height: 85vh;">
                <li>
                    <div class="px-6"
                        v-for="room in rooms" :key="room.id"
                    >
                        <div class="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div v-if="room.owner_id === user_id" @click="changeRoomSetting(room)" class="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
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
                                            autoComplete="true" type="password" name="serch" :placeholder="password_placeholder" class="bg-white h-10 px-5 pr-20 rounded-full text-sm focus:outline-none"
                                            v-model="user_room_pass"
                                            :class="badInput"
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


                                <div v-if="isJoined(room.id)" @click="getRoomData(room.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" style="float: left; margin-right: 8px;"  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <span>Chat</span>
                                </div>


                                <div v-else @click="joinToRoom(room.id, room.locked)" >
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
        <room-setting-block v-if="isPopUp"
            :input_place_holder="clickedRoom.locked ? 'change password' : 'new password'"
            :room_name="clickedRoom.name"
            @cancel-room-update="isPopUp = false"
            @remove-room="removeRoom"
            @update-room-password="updateRoomPassword"
        />
    </div>
</template>


<script lang="ts">


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


import RoomSettingBlock from './RoomSetting.vue';

export default defineComponent({
    name: 'PublicChatBlock',
    components:{
        'room-setting-block' : RoomSettingBlock,
    },
    data()
    {
        return {
            password_placeholder: 'password' as string,
            isPopUp: false as boolean,
            invalid_pass: false as boolean,
            user_room_pass: '' as string,
            typing_room_id: -1 as number,    
			token: '' as String,
			user_id: 0,
			username: '' as String,
			avatar: '' as String,
            clickedRoom: null as any,
			joinedRooms: [] as Number[],        
        }
    },
    watch:{
        async user_id(){
            await Promise.all([this.newGetRooms(), this.getJoinedRooms()]).then((output:Array<any>) => {
                store.commit('updateRooms', output[0].data);
                this.joinedRooms = output[1].data.joinedRooms;
                ////console.log('joined rooms: ', this.joinedRooms);
            });
        }
    },
    methods: {
        changeRoomSetting(room:Room){
            this.clickedRoom = room;
            this.isPopUp = true;
        },
        newGetRooms(){
            return axios({
                method: 'get',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/room`,
            });
        },
        joinTheRoom(roomId:number, password:string){
            axios({
                method: 'POST',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/room/checkroompass/`,
                data:{room_pass: password, room_id: roomId}
            }).then(({data}) => {

                if (data.status || password === ''){
                    // means valid password
                    this.getRoomData(roomId);
                } else {
                    this.passIsInvalid();
                }
            });
        },
		getJoinedRooms(){
			return axios({
				method: 'POST',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/joinedRooms`,
                data: {id:this.user_id}
			});
		},
        joinToRoom(room_id:number, is_locked:boolean)
        {
            // probably this function shoould by async
            if (is_locked)
                this.joinToPrivateRoom(room_id);
            else
                this.joinTheRoom(room_id, '');
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
                ////console.log("joining to private with pass: ", tmp_pass);
                this.joinTheRoom(room.id, tmp_pass);
            }else{
                this.passIsInvalid();
            }
        },
        passIsInvalid(){
            this.invalid_pass = true;
            this.password_placeholder = 'invalid passowrd';
            this.user_room_pass = '';
        },
        async getRoomData(room_id:number)
        {
			store.commit('setRoomId', room_id);
            router.push({name: 'chatpublicmsg', query: { roomId: room_id}});
        },
        userIsTyping(e:any)
        {
            if (e.keyCode !== 13){
                this.password_placeholder = 'passowrd';
                this.invalid_pass = false;
            }
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
            this.password_placeholder = 'passowrd';
            this.invalid_pass = false;
            this.user_room_pass = '';
        },
		isJoined(id:number)
		{
            if (this.joinedRooms === undefined)
                return true; // maybe false
			return this.joinedRooms.includes(id);
		},
        async removeRoom(){
            const resp = await axios.delete(
                `http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.clickedRoom.id}`,
			);
            this.isPopUp = false;
            //removeRoomWithId
            store.commit('removeRoomWithId', this.clickedRoom.id);
        },
        async updateRoomPassword(newpass:string){
            ////console.log(`new password ${newpass}`);

            const resp = await axios.patch(
					`http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.clickedRoom.id}`,
					{
                        password: newpass
					},
				);
            this.isPopUp = false;
            store.commit('updateRoomAccess', {room_id:this.clickedRoom.id, access: newpass.length !== 0 ? true: false});
        },
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
        },
        badInput(): string {
            if (this.invalid_pass)
                return 'bg-red-600';
            return '';
        }
    }
})


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