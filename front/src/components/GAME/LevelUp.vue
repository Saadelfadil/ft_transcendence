<template>
    <div class="container mx-auto">

    <div v-if="start == 1">


        <div class="flex justify-around mb-3 py-5 rounded-lg bg-white mt-3">
            
            <div class="flex justify-around bg-blue w-3/12">
                <div class="flex flex-col">
                    <img :src="left_player_avatar" class="rounded-full max-w-xs w-16 items-center border" />
                    <div>{{left_player_login}} </div>
                </div>
                <div class="mt-2.5"> {{playerLeft.score}} </div>
            </div>

            <div>
                <div v-if="game_state == 0"> waiting... </div>
                <div v-else-if="game_state == 1"> {{timer}} </div>
                <div v-else>
                    <div class="mt-2.5"> {{time_min}} : {{time_sec}} </div>
                </div>
            </div>

            <div class="flex justify-around bg-blue w-3/12">
                <div class="flex flex-col">
                    <img :src="right_player_avatar" class="rounded-full max-w-xs w-16 items-center border" />
                    <div>{{right_player_login}} </div>
                </div>
                <div class="mt-2.5"> {{playerRight.score}} </div>
            </div>
            
        </div>

        <div class="w-full">    
            <div class="overflow-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" style="height: 70vh;">
                <div id = "pong-table" class="pong-table flex justify-center">
                    <canvas id="canvas"></canvas>
                </div>
            </div>
        </div>

    </div>
    <StartPlayingComp v-else @startPlaying="levelup"/>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import router from '@/router';
import { io } from "socket.io-client";
import StartPlayingComp from './StartPlaying.vue';
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

export default defineComponent({
    name: 'LevelUpBlock',
        components:{
        StartPlayingComp
    },
    data(){
        return{
            start: 0  as number,
            socket : null as any,
            canvas: 0 as any,
            game_state: 0 as number,
            left_player_login: '' as string,
            right_player_login : '' as string,
            left_player_avatar: 'https://www.techopedia.com/images/uploads/6e13a6b3-28b6-454a-bef3-92d3d5529007.jpeg' as string,
            right_player_avatar: 'https://www.techopedia.com/images/uploads/6e13a6b3-28b6-454a-bef3-92d3d5529007.jpeg' as string,
            canvasGrd: 0 as any,
            context: 0 as any,
            logged: false as boolean,
            user_id: 0 as number,
            factor: 0 as number,
            scw: 0 as number,
            sch: 0 as number,
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
            timer: 0 as number,
            gameCounter: 0 as number,
            playerPos: '' as string,
            plName: '' as string,
            prName: '' as string,
            timerInterval: null as any,
            tmp_number_min: 0 as number,
            tmp_number_sec: 0 as number,
        }
    },
    computed: {
        time_min(): string {
            // return '00';
            this.tmp_number_min = Math.floor(this.gameCounter / 60);
            if (this.tmp_number_min === 0)
            {
                return '00';
            }
            else if (this.tmp_number_min < 10)
                return '0' + this.tmp_number_min.toString();
            return  this.tmp_number_min.toString();
        },
        time_sec(): string {
            // return '11';
            this.tmp_number_sec = this.gameCounter % 60;
            if (this.tmp_number_sec === 0)
                return '00';
            else if (this.tmp_number_sec < 10)
                return '0' + this.tmp_number_sec.toString();
            return this.tmp_number_sec.toString();
        }
    },
    watch: {
        plName() {
            this.leftLogin();
        },
        prName() {
            this.rightLogin();
        }
    },
    methods: {
        async leftLogin(){
            try{
                const resp = await axios({
                    method: 'post',
                    data: {
                        id:+this.plName,
                    },
                    url: 'http://localhost:8080/api/getloginbyid',
                    withCredentials: true
                });
                this.left_player_login = resp.data.login;
                this.left_player_avatar = resp.data.image_url;
            }catch(e){
                console.log(e);
            }
        },
        async rightLogin(){
            try{
                const resp = await axios({
                    method: 'post',
                    data: {
                        id:+this.prName,
                    },
                    url: 'http://localhost:8080/api/getloginbyid',
                    withCredentials: true
                });
                this.right_player_login = resp.data.login;
                this.right_player_avatar = resp.data.image_url;
            }catch(e){
                console.log(e);
            }
        },
        initGame(scw: number, sch: number){
            this.scw = scw;
            this.sch = sch;
            this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
            this.canvas.width = this.canvas.offsetWidth ;
            this.factor = this.canvas.width / scw;

            window.addEventListener('resize', () => {
                this.canvas.width = this.canvas.offsetWidth ;
                this.factor = this.canvas.width / this.scw;
                this.canvas.height = this.sch * this.factor;
            });

            this.canvas.height = sch * this.factor;

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
        renderGame(): void{
            this.context.fillStyle = this.canvasGrd;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.beginPath();
            this.context.arc(this.canvas.width/2, this.canvas.height/2, this.canvas.height/6, 0, 2 * Math.PI);
            this.context.lineWidth = 2.5;
            this.context.strokeStyle = "WHITE";
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(0, this.canvas.height/2, this.canvas.height/8, 3/2 * Math.PI , 1/2 * Math.PI);
            this.context.lineWidth = 2;
            this.context.strokeStyle = "WHITE";
            this.context.stroke();

            this.context.beginPath();
            this.context.arc(this.canvas.width, this.canvas.height/2, this.canvas.height/8, 1/2 * Math.PI, 3/2 * Math.PI);
            this.context.lineWidth = 2;
            this.context.strokeStyle = "WHITE";
            this.context.stroke();

            this.context.beginPath(); 
            this.context.moveTo(this.canvas.width/2, 0);
            this.context.lineTo(this.canvas.width/2,this.canvas.height);
            this.context.stroke();

            this.context.fillStyle = this.playerLeft.color;
            this.context.fillRect(this.playerRight.x * this.factor, this.playerRight.y * this.factor, this.playerRight.w * this.factor, this.playerRight.h * this.factor);
            this.context.fillRect(this.playerLeft.x * this.factor, this.playerLeft.y * this.factor, this.playerLeft.w * this.factor, this.playerLeft.h * this.factor);
            //console.log(this.ball.x);
            this.context.fillStyle = this.ball.color;
            this.context.beginPath();
            this.context.arc(this.ball.x * this.factor, this.ball.y * this.factor, this.ball.r * this.factor, 0, Math.PI*2,false);
            this.context.closePath();
            this.context.fill();
        },
        startMouseEvent(){
            // this.socket.emit("startTime");
            //this.socket.emit("startGame");
            this.canvas.addEventListener("mousemove", (e: any) => {
                //console.log(`her${this.canvasHtml.getBoundingClientRect().top}`);
                let cursPos = e.clientY - this.canvas.getBoundingClientRect().top;
                //console.log(cursPos);
                this.socket.emit("updatePos", cursPos / this.factor);
            });
        },
        levelup(){
            this.start = 1;
            window.addEventListener('beforeunload', this.tabClosed);
            document.addEventListener('visibilitychange', this.tabChanged);

            //let msgHtml = document.getElementById('msg') as any;
            this.socket = io("http://localhost:3000/levelup");
            this.socket.on('connect', () => {

                this.socket.emit('clientType', {userId: this.user_id ,type: 'play', room: ''});

                this.socket.on('waitingForRoom', (pos: string) => {
                    this.playerPos = pos;
                    console.log(pos);
                    // msgHtml.innerHTML = `Waiting for Room, you are ${pos} player`;
                    this.game_state = 0;
                });

                this.socket.on('connectedToRoom', (timer: number, players: string[]) => {
                    // this.playerPos = pos;
                    // console.log(room);
                    // msgHtml.innerHTML = `connected to room ${room}, you are ${pos} player`;
                    this.timer = timer;
                    this.plName = players[0];
                    this.prName = players[1];
                    this.timerInterval = setInterval(() => {
                        if (this.timer <= 0){
                            clearInterval(this.timerInterval);
                        }
                        else{
                            this.timer--;
                            console.log(this.timer);
                        }
                    }, 1000);
                    this.game_state = 1;
                });

                this.socket.on('roomCreated', (room: string, players: string[]) => {
                    // msgHtml.innerHTML = `hello ${this.playerPos}`;
                    this.socket.emit('setRoom', room);

                    this.socket.on("startMouseEvent", () => {
                        this.startMouseEvent();
                        this.game_state = 2;
                        this.socket.on("updateClient", (clientData: any) => {
                            this.playerLeft = clientData.pl;
                            this.playerRight = clientData.pr;
                            this.ball = clientData.b;
                            // console.log(clientData.pl);
                            // console.log(clientData.pr);
                            //console.log(clientData.b);
                            if (clientData.b && clientData.pr && clientData.pl){
                                //console.log('render')
                                this.renderGame();
                            }
                        });
                    });

                    this.socket.on('updateTime', (time: number) => {
                        this.gameCounter = time;
                    })

                });

                this.socket.on("initData", (clientData: any) => {
                    this.playerLeft = clientData.pl;
                    this.playerRight = clientData.pr;
                    this.ball = clientData.b;
                    //console.log(clientData.pl);
                    this.initGame(clientData.scw, clientData.sch);
                });

                this.socket.on("leaveRoom", () => {
                    //this.socket.emit('clear');
                    this.$router.push('/profile');
                });
                console.log(this.socket.id);

            });
        },
        async isUserPlaying(){
            const resp = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/getgamestatus',
                data: {
                    user_id: this.user_id,
                }
            });

            if (resp.data.in_game)
            {
                router.push({name: 'profile'});
                return ;
            }
        },
        tabClosed(event:any){
            if (this.socket)
                this.socket.disconnect();
        },
        tabChanged(event:any){
            this.tabClosed(event);
            router.replace({name: 'profile'});
        },
    },
    beforeUnmount(){
        if (this.start === 1) // which means event was added before
        {
            window.removeEventListener('beforeunload', this.tabClosed);
            document.removeEventListener('visibilitychange', this.tabChanged);
        }
    },
    unmounted(){
        console.log('levelup unmounted');
        //this.socket.emit("stopTime");
        if (this.timerInterval)
            clearInterval(this.timerInterval);
        if (this.socket)
            this.socket.disconnect();
    },
})
</script>


<style scoped>


#canvas {
    /* margin-top: 10px; */
    border: solid 1px rgb(240, 46, 170);
    background: rgb(177,255,185);
    background: radial-gradient(circle, rgba(177,255,185,1) 0%, rgba(36,252,82,1) 100%);
    width: 100%;
    object-fit: contain;
    /* height: 800; */
    max-width: 800px;
    box-shadow: rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px;
    /* max-height: 800px; */
    /* position: absolute; */
    /* overflow: hidden; */

}



.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}


</style>
