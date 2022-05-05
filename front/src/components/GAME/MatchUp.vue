<template>
    <div class="container mx-auto">
        <p id="msg"></p>
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
        </div>
    
        <div id = "pong-table" class="pong-table flex justify-center">
            <canvas id="canvas"></canvas>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import router from '@/router';
import { io } from "socket.io-client";
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
    name: 'MatchUpBlock',
    data(){
        return{
            socket : null as any,
            canvas: 0 as any,
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
            playerPos: '' as string,
            plName: '' as string,
            prName: '' as string,
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
                router.push({name : 'login'});
                return;
            }
        },
        matchup(){
            
            let msgHtml = document.getElementById('msg') as any;
            this.socket = io("http://localhost:3000/matchup");
            this.socket.on('connect', () => {
                
                this.socket.emit('clientType', {userId: this.user_id ,type: 'play', room: ''});
                
                this.socket.on('waitingForRoom', (pos: string) => {
                    this.playerPos = pos;
                    console.log(pos);
                    msgHtml.innerHTML = `Waiting for Room, you are ${pos} player`;
                });

                this.socket.on('connectedToRoom', (room: string, pos: string) => {
                    this.playerPos = pos;
                    console.log(pos);
                    msgHtml.innerHTML = `connected to room ${room}, you are ${pos} player`;
                });
                
                this.socket.on('roomCreated', (room: string, players: string[]) => {
                    msgHtml.innerHTML = `hello ${this.playerPos}`;
                    this.socket.emit('setRoom', room);
                    this.plName = players[0];
                    this.prName = players[1];
                    
                    this.socket.on("startMouseEvent", () => {
                        this.startMouseEvent();
                        
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
        }
    },
    async mounted(){
        console.log('matchup mounted');
        await this.checkLogin();
        //await this.isUserPlaying();
        this.matchup();
    },
    unmounted(){
        console.log('matchup unmounted');
        //this.socket.emit("stopTime");
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

</style>
