<template>
    <div class="container mx-auto">
        <p id="msg"></p>
        <div id="popup" class="popup">
            <span class="msg fadeIn">{{timeMsg}}</span>
            <span id="countdown" class="countdown fadeIn">{{timer}}</span>
        </div>
        <div class="flex justify-center">
            <div class="player">
                <span id="player-left-name" class="">{{plName}}</span>
                <span id="player-left-score"> : {{playerLeft.score}} </span>
            </div>
            <div class="mx-8 vs"> VS </div>
            <div class="player">
                <span id="player-right-score"> {{playerRight.score}} : </span>
                <span id="player-right-name" class=""> AI </span>
            </div>
        </div>
        <div id = "pong-table" class="pong-table flex justify-center">
            <canvas id="canvas" ></canvas>
        </div>
    </div>
</template>

<script lang="ts">
import { io } from "socket.io-client";
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
    
    data() {
        return {
            socket : io("http://localhost:3000/warmup") as any,
            canvas: 0 as any,
            // canvasHtml: any;
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
            timeMsg: 'Start In : ',
        }
    
    },
    methods: {
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

        timerBeforStart(countdown: number){
            let counter = countdown;
            let counterHtml : any = document.getElementById("countdown");
            let popup : any = document.getElementById("popup");
            const timerInterval = setInterval(() => {
                this.timer = counter;
                if (counter <= 0){
                    this.timeMsg = 'Countdown : ';
                    clearInterval(timerInterval);
                    popup.classList.add('fade');
                    this.startGame();
                }
                else{
                    counter--;
                }
            }, 1000);
        },

        startGame(){
            this.socket.emit("startTime");
            this.socket.emit("startGame");
            this.canvas.addEventListener("mousemove", (e: any) => {
                this.playerLeft.y = e.clientY - this.canvas.getBoundingClientRect().top - this.playerLeft.h/2;
                this.socket.emit("updatePos", this.playerLeft);
            });
        }
    },

    mounted(){
        console.log('warmup mounted');
        let popup : any = document.getElementById("popup");
        popup.classList.remove('fade');
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas.width = this.canvas.offsetWidth ;
        this.canvas.height = this.canvas.width / 1.5;
        console.log(this.canvas.height, this.canvas.width);
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
        
        this.socket.on("connect", () => {
            this.plName = this.socket.id;
            console.log(this.canvas.height, this.canvas.width);
            this.socket.emit("initGame", { 
                canvasW: this.canvas.width, 
                canvasH: this.canvas.height
            });
        });
        this.timerBeforStart(this.countdown);

        this.socket.on("updateClient", (clientData: any) => {
            this.playerLeft = clientData.pl;
            this.playerRight = clientData.pr;
            this.ball = clientData.b;
            //console.log(this.ball.x);
            this.renderGame();
        });

        this.socket.on("disconnect", () => {
            console.log(`${this.socket.id} disconnected`); // world
        });

        this.socket.on("updateTime", (time: number) => {
            this.timer = time;
            //console.log(time);
        });

        this.socket.on("leaveRoom", () => {
            this.$router.push('/profile');
        });
    },

    unmounted(){
        console.log('warmup unmounted');
        //this.socket.emit("stopTime");
        this.socket.disconnect();
    }
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

/* .msg {
    font-size: 28px;
} */

/* .countdown {
    font-size: 35px;
}

.popup {
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 48%;
    text-align: center;
}

.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    }
    @-webkit-keyframes fadeIn {
    0% {opacity: 0;}
    100% {opacity: 1;}
    }
    @keyframes fadeIn {
    0% {opacity: 0;}
    100% {opacity: 1;}
} 

.match-data {
    text-align: center;
}

.vs{
    font-size: 30px;
    font-weight: bold;
}

.player {
    font-size: 20px;
}

.pong-table {

} */

</style>