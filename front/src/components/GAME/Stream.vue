<template>

<div>
<div class="h-full mt-5">
 
  <div class="border-b-2 block md:flex" style="height:80vh">

    <div class="w-full md:w-3/6 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
       <div class="container mx-auto">


        <!-- <div class ="columns-2"> -->

            <div class="">
                <!-- <p id="msg"></p>
                <div id="popup" class="popup">
                    <span class="msg fadeIn">Start In:</span>
                    <span id="countdown" class="countdown fadeIn">0</span>
                </div>
                <div class="flex justify-between">
                    <div class="player">
                        <span id="player-left-name" class="mr-8">{{plName}}</span>
                        <span id="player-left-score"> {{playerLeft.score}} </span>
                    </div>
                    <div class="vs"> VS </div>
                    <div class="player">
                        <span id="player-right-score"> {{playerRight.score}} </span>
                        <span id="player-right-name" class="ml-8"> {{prName}} </span>
                    </div>
                </div> -->


                <div id = "pong-table" class="pong-table">
                    <canvas id="canvas" width="800" height="500" ></canvas>
                </div>
            </div>
        
        <!-- </div> -->

        </div>
    </div>
    
    <div class="w-full md:w-3/6 p-8 bg-white lg:ml-4 shadow-md">
        <div class="grid grid-cols-1 min-w-full rounded">
                <ul class="overflow-auto" style="height: 70vh;">
                    <li>
                        <div class="px-6"
                        v-for="(oneroom, index) in room_display" :key="rooms_info[index].id"
                        >
                        <div class="flex justify-around items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                                <div class="ml-2">
                                    <div class="cursor-pointer" @click="redirect_left_player(oneroom.left_player.id)">
                                        <img id="showImage" class="w-24 h-24  rounded-full max-w-xs w-32 items-center border" :src="oneroom.left_player.image_url">
                                        <div class="text-center">{{oneroom.left_player.login}}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center cursor-pointer" @click="roomClicked(rooms_info[index].namespace, rooms_info[index].name)">
                                    {{ rooms_info[index].namespace }}
                            </div>

                            <div class="flex items-center">
                                <div class="ml-5">
                                    <div class="cursor-pointer" @click="redirect_left_player(oneroom.right_player.id)">
                                        <img id="showImage" class="w-24 h-24 rounded-full max-w-xs w-32 items-center border" :src="oneroom.right_player.image_url">
                                        <div class="text-center">{{oneroom.right_player.login}}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>

                            </div>
                        </div>

                        </div>

                    </li>
                </ul>
            </div>
    </div>

  </div>

</div>

</div>

</template>


<script lang="ts">

import { defineComponent } from 'vue'
import { io } from "socket.io-client";

import axios from 'axios';
import router from '@/router';

interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    score: number;
    color: string;
}

interface Ball {
    x: number,
    y: number,
    r: number,
    speed: number,
    velocityX: number,
    velocityY: number,
    color: string,
}

interface streamRoom{
    id:number;
    players: Array<number>;
    namespace: string;
};

interface Player{
    id:number;
    login:string;
    image_url:string;
};

interface OneRoom{
    left_player: Player;
    right_player: Player;
};

export default defineComponent({
    name: 'ProfileBlock',
    data()
    {
        return {
            user_id: 0 as number,
            users_ids: [] as Array<number>,
            logged: false as boolean,
            rooms_info: [] as Array<streamRoom>,
            room_display: [] as Array<OneRoom>,
            socket : null as any,
            canvas: 0 as any,
            canvasGrd: 0 as any,
            context: 0 as any,
            playerRight: {
                x: 0 as number, 
                y: 0 as number,
                w: 0 as number,
                h: 0 as number,
                score: 0 as number,
                color: ''  as string,
            } as Player,
            playerLeft: {
                x: 0 as number, 
                y: 0 as number,
                w: 0 as number,
                h: 0 as number,
                score: 0 as number,
                color: ''  as string,
            } as Player,
            ball: {
                x: 0 as number,
                y: 0 as number,
                r: 0 as number,
                speed: 0 as number,
                velocityX: 0 as  number,
                velocityY: 0 as number,
                color: '' as string,
            } as Ball,

            gameRooms: [] as any
        }
    },
    async created(){
        await this.checkLogin();
        if (!this.logged){
            router.push({name: 'login'});
            return ;
        }
        await this.InitMatchHistory();
        await this.getUsers();
    },
    methods:{
        async InitMatchHistory()
        {
            try{
                const resp = await axios({
                    method: 'get',
                    url: 'http://localhost:3000/game/rooms'
                });
                this.rooms_info = resp.data;

                // start tests
                //end tests
                this.users_ids = [];
                this.rooms_info.map((inp:streamRoom) => {
                    this.users_ids.push(inp.players[0]);
                    this.users_ids.push(inp.players[1]);
                });
            }
            catch(e)
            {
                console.log(e);
            }
        },
        async getUsers()
        {
            try {
                const resp = await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/getusers',
                    data : {usersId: this.users_ids}
                });
                this.room_display = resp.data;
            }catch(e){
                console.log(e);
            }
        },
        redirect_left_player(target_id:number)
        {
            if (target_id === -1) {
                // which means playes against robot
                return ;
            }
            if (target_id === this.user_id) {
                router.push({name: 'profile'});
                return ;
            }
            router.push({name: 'FriendProfile', query: {friend_id: target_id}});
        },
        async checkLogin()
        {
            try{
                const resp = await axios({
                    method: 'get',
                    url: 'http://localhost:8080/api/islogin',
                    withCredentials: true
                });
                this.logged = true;
                this.user_id = resp.data.id;
            }
            catch(e)
            {
                this.logged = false;
            }
        },
        startStreaming(stream_id:number)
        {
            console.log(`stream id ${stream_id}`);
        },
        renderGame(): void{
            this.context.fillStyle = this.canvasGrd;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.fillStyle = this.playerLeft.color;
            this.context.fillRect(this.playerRight.x, this.playerRight.y, this.playerRight.w, this.playerRight.h);
            this.context.fillRect(this.playerLeft.x, this.playerLeft.y, this.playerLeft.w, this.playerLeft.h);

            this.context.fillStyle = this.ball.color;
            this.context.beginPath();
            this.context.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI*2,false);
            this.context.closePath();
            this.context.fill();
        },
        async getRooms(){
            const resp = await axios.get('http://localhost:3000/game/rooms');
            this.gameRooms = resp.data;
            console.log(resp.data);
        },

        roomClicked(namespace:string, name:string)
        {
            console.log(typeof name);
            if (this.socket){
                this.socket.disconnect();
            }
            this.socket = io(`http://localhost:3000/${namespace}`);
            this.socket.on('connect', () => {
                this.socket.emit('clientType', {type: 'stream',room: name});
                console.log(this.socket.id);
            });
            this.socket.on("updateClient", (clientData: any) => {
                this.playerLeft = clientData.pl;
                this.playerRight = clientData.pr;
                this.ball = clientData.b;
                //console.log(clientData.pl);
                this.renderGame();
            });
            this.socket.on("leaveRoom", () => {
                this.$router.push('/game/stream');
            });
        }
    },
    mounted(){
        console.log('stream mounted');

        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = (this.canvas as HTMLCanvasElement).getContext('2d');
        this.canvasGrd = this.context.createRadialGradient(
            this.canvas.width/2,
                this.canvas.height/2, 
                5,
                this.canvas.width/2,
                this.canvas.height/2,
                this.canvas.height
            );
        this.canvasGrd.addColorStop(0, "rgb(177,255,185)");
        this.canvasGrd.addColorStop(1, "rgb(36,252,82,1)");
        this.renderGame();

    },
    unmounted(){
        console.log('stream unmounted');
        // this.socket.emit("stopTime");
        if(this.socket)
            this.socket.disconnect();
    },
})

</script>