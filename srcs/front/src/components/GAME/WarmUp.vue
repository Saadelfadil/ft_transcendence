<template>
    <div class="container mx-auto">

        
	<!-- start of nav bar of streeam-->


    <div class="flex justify-around mb-3 py-5 rounded-lg bg-white mt-3">
	<div class="flex justify-around bg-blue w-3/12">
		<div class="flex flex-col">
		    <img :src="left_player_avatar" v-if="left_player_avatar != ''"  class="rounded-full max-w-xs w-16 items-center border" />
		    <div class="text-center"> {{left_player_login}}</div>
		</div>
		<div class="mt-2.5"> {{playerLeft.score}} </div>
	</div>
	<div>

	<div>

		<div v-if="game_state == 0"> {{timer}} </div>
		<div v-else>
		    <div class="mt-2.5">VS</div>
		</div>
	</div>

	</div>

	<div class="flex justify-around bg-blue w-3/12">
		<div class="flex flex-col">
		    <img :src="right_player_avatar" v-if="right_player_avatar != ''" class="rounded-full max-w-xs w-16 items-center border" />
		    <div>{{right_player_login}} </div>
		</div>
		<div class="mt-2.5"> {{playerRight.score}} </div>
	</div>

    </div>
	<!-- end of nav bar of streeam-->

        <div class="w-full">    
            <div class="overflow-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" style="height: 70vh;">
        <div id = "pong-table" class="pong-table flex justify-center">
            <canvas id="canvas" ></canvas>
        </div>
            </div>
            </div>
</div>
</template>

<script lang="ts">
import { io } from "socket.io-client";
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { defineComponent } from 'vue';

interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    score: number;
    color: string
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

export default  defineComponent({
    name: 'WarmUpBlock',
    data() {
        return {
            game_state: 0 as number,
            left_player_avatar: '' as string,
            left_player_login: '' as string,
            right_player_avatar: '' as string,
            right_player_login: '' as string,
            socket : null as any,
            canvas: 0 as any,
            logged: false as boolean,
            user_id: 0 as number,
            factor: 0 as number,
            scw: 0 as number,
            sch: 0 as number,
            canvasGrd: 0 as any,
            context: 0 as any,
            playerRight: {
                x: 0 as number, 
                y: 0 as number,
                w: 0 as number,
                h: 0 as number,
                score: 0 as number,
                color: ''  as string
            } as Player,
            playerLeft: {
                x: 0 as number, 
                y: 0 as number,
                w: 0 as number,
                h: 0 as number,
                score: 0 as number,
                color: ''  as string
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
            countdown: 5 as number,
            timer: 0 as number,
            plName: '' as string,
            // timeMsg: 'Start In : ',
        }
    },
    methods: {
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

            this.context.fillStyle = this.playerLeft.color;
            
            this.context.fillRect(this.playerRight.x * this.factor, this.playerRight.y * this.factor, this.playerRight.w * this.factor, this.playerRight.h * this.factor);
            this.context.fillRect(this.playerLeft.x * this.factor, this.playerLeft.y * this.factor, this.playerLeft.w * this.factor, this.playerLeft.h * this.factor);
            
            this.context.fillStyle = this.ball.color;
            this.context.beginPath();
            this.context.arc(this.ball.x * this.factor, this.ball.y * this.factor, this.ball.r * this.factor, 0, Math.PI*2,false);
            this.context.closePath();
            this.context.fill();
        },

        timerBeforStart(countdown: number){
            let counter = countdown;
            // let counterHtml : any = document.getElementById("countdown");
            // let popup : any = document.getElementById("popup");
            const timerInterval = setInterval(() => {
                this.timer = counter;
                if (counter <= 0){
                    // this.timeMsg = 'Go';
                    clearInterval(timerInterval);
                    // popup.classList.add('fade');
                    this.startGame();
                }
                else{
                    counter--;
                }
            }, 1000);
        },

        startGame(){
            this.socket.emit("startGame");
            this.game_state = 1;
            this.canvas.addEventListener("mousemove", (e: any) => {
                let cursPos = e.clientY - this.canvas.getBoundingClientRect().top;
                this.socket.emit("updatePos", cursPos / this.factor);
            });
        },
        warmup()
        {
            // let popup : any = document.getElementById("popup");
            // popup.classList.remove('fade');
            
            this.socket = io(`http://${process.env.VUE_APP_HOST_IP}:3000/warmup`);
            this.socket.on("connect", () => {
                this.plName = this.user_id.toString();
                this.socket.emit("initGame", {userId: this.user_id});

                this.socket.on("initData", (clientData: any) => {
                    this.playerLeft = clientData.pl;
                    this.playerRight = clientData.pr;
                    this.ball = clientData.b;
                    //////console.log(clientData.pl);
                    this.initGame(clientData.scw, clientData.sch);
                });

                this.timerBeforStart(this.countdown);

                this.socket.on("updateClient", (clientData: any) => {
                    this.playerLeft = clientData.pl;
                    this.playerRight = clientData.pr;
                    this.ball = clientData.b;
                    //////console.log(this.ball.x);
                    this.renderGame();
                });

                this.socket.on("disconnect", () => {
                    ////console.log(`${this.socket.id} disconnected`); // world
                });

                this.socket.on("updateTime", (time: number) => {
                    this.timer = time;
                    //////console.log(time);
                });

                this.socket.on("leaveRoom", () => {
                    this.$router.push('/profile');
                });
            });
        },
        async isUserPlaying(){
            const resp = await axios({
                method: 'POST',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/getgamestatus`,
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
        async fillPlayersData(){
            try {
                let resp = await  axios({
                    method: 'POST',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/getloginbyid`,
                    data: {id: this.user_id}
                });
                this.left_player_avatar = resp.data.image_url;
                this.left_player_login = resp.data.login;

                resp = await  axios({
                    method: 'POST',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/getloginbyid`,
                    data: {id: 0}
                });

                this.right_player_avatar = resp.data.image_url;
                this.right_player_login = resp.data.login;
            }catch(e){
                ////console.log(e);
            }
        }
    },
    watch:{
        async user_id(){
            ////console.log("at warm up: ", this.user_id);
            await this.fillPlayersData();
            //await this.isUserPlaying();
            this.warmup();
        }
    },
    unmounted(){
        ////console.log('warmup unmounted');
        //this.socket.emit("stopTime");
        this.socket.disconnect();
    },
});
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