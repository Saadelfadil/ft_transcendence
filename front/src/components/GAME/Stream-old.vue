<template>
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
            <div class=""
                v-for="(room, index) in rooms" :key="room.id"
                    @click="roomClicked(index)"
                > 
                {{ room.name }}
                <br />
                {{room.id}}
            </div>
        <!-- </div> -->

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { io } from "socket.io-client";
import axios from 'axios';

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
    name: 'StreamBlock',
     data(){
        return{
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
        async getRooms(){
            const resp = await axios.get(`http://${process.env.VUE_APP_HOST_IP}:3000/game/rooms`);
            this.gameRooms = resp.data;
            //console.log(resp.data);
        },

        roomClicked(index:any)
        {
            if (this.socket){
                this.socket.disconnect();
            }
            this.socket = io(`http://${process.env.VUE_APP_HOST_IP}:3000/${this.gameRooms[index].namespace}`);
            this.socket.on('connect', () => {
                this.socket.emit('clientType', {type: 'stream',room: this.gameRooms[index].name});
                //console.log(this.socket.id);
            });
            this.socket.on("updateClient", (clientData: any) => {
                this.playerLeft = clientData.pl;
                this.playerRight = clientData.pr;
                this.ball = clientData.b;
                ////console.log(clientData.pl);
                this.renderGame();
            });
            this.socket.on("leaveRoom", () => {
                this.$router.push('/game/stream');
            });
        }

    },
    computed: {
        rooms()  {
            const tmp : any = this.gameRooms.reverse();
            return tmp;
        }
    },
    async created(){
        await this.getRooms();

    },
    mounted(){
        //console.log('stream mounted');

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
        //console.log('stream unmounted');
        // this.socket.emit("stopTime");
        if(this.socket)
            this.socket.disconnect();
    },
})

</script>