<template>
    <div>
    <div class="grid grid-cols-1 min-w-full border rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
                    <li>
                        <div class="px-6"
                        v-for="(onehistory, index) in historyDisplay" :key="matchs_info[index].id"
                        >
                        <div v-if="index >= prev && index < limit" class="flex justify-around items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                                <div class="ml-2">
                                    <div @click="redirect_left_player(onehistory.left_player.id)"
                                    :class="isValidToClick(onehistory.left_player.id)"
                                    >
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="onehistory.left_player.image_url">
                                        <div class="text-center">{{onehistory.left_player.login}}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="ml-2">
                                    <div class="text-center mb-3">
                                        {{ matchs_info[index].type }}
                                    </div>
                                    <div class="text-center">
                                        {{ matchs_info[index].data[0].score }} - {{ matchs_info[index].data[1].score }}
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center">
                                <div class="ml-5">
                                    <div  @click="redirect_left_player(onehistory.right_player.id)"
                                        :class="isValidToClick(onehistory.right_player.id)"
                                    >
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="onehistory.right_player.image_url">
                                        <div class="text-center">{{onehistory.right_player.login}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>

                    </li>
                </ul>
            </div>
                    <div class="grid place-items-center">

                <ul class="flex"> 
                
                <li @click="previous()" class="mx-1 px-3 py-2 bg-gray-200 text-gray-500  hover:bg-gray-700 hover:text-gray-200 rounded-lg">
                    <a class="flex items-center font-bold" href="#">
                        <span class="mx-1">previous</span>
                    </a>
                </li>
                <li class="mx-1 px-3 py-2 bg-gray-200 text-gray-700  rounded-lg">
                    <a class="font-bold" href="#">{{page}}</a>
                </li>
                <li @click="next()" class="mx-1 px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-gray-200 rounded-lg">
                    <a class="flex items-center font-bold" href="#">
                        <span class="mx-1">Next</span>
                    </a>
                </li>
            </ul> 
    </div>
        </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import router from '@/router';

interface Match {
    id: number,
    data: Array<{id:number, score:number}>, // of size fixed 2
    type: string,
};

interface Player{
    id:number;
    login:string;
    image_url:string;
};

interface OneHistory
{
    left_player: Player;
    right_player: Player;
};

export default defineComponent({
    name: 'MatchHistoryBlock',
    data()
    {
        return {
            logged: false as boolean,
            user_id: 0 as number,
            msg: 'LeaderBoard here' as string,
            users_ids: [] as Array<number>,
            matchs_info : [] as Array<Match>,
            match_display: [] as Array<OneHistory>,

            page : 1 as number,
            prev: 0 as number,
            factor : 5 as number,
            limit :5 as number,
        }
    },
    async created()
    {
        await this.InitMatchHistory();
        await this.getUsers();
    },
    methods:{
        isValidToClick(id:number){
            if (id)
                return 'cursor-pointer';
            return '';
        },
        async InitMatchHistory()
        {
            try{
                const resp = await axios({
                    method: 'get',
                    url: `http://${process.env.VUE_APP_HOST_IP}:3000/game/matchs/` + (this.$route.query.history_id ? this.$route.query.history_id : '')
                });
                this.matchs_info = resp.data.reverse();
                this.users_ids = []; // do not remove this line

                this.matchs_info.map((inp:Match) => {
                    this.users_ids.push(+inp.data[0].id);
                    this.users_ids.push(+inp.data[1].id);
                });
            }
            catch(e)
            {
                ////console.log(e);
            }
        },
        async getUsers()
        {
            try {
                const resp = await axios({
                    method: 'post',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/getusers`,
                    data : {usersId: this.users_ids}
                });
                this.match_display = resp.data;
            } catch(e){
                ////console.log(e);
            }
        },
        redirect_left_player(target_id:number)
        {
            if (target_id === 0) {
                // which means playes against robot
                return ;
            }
            if (target_id === this.user_id) {
                router.push({name: 'profile'});
                return ;
            }
            router.push({name: 'FriendProfile', query: {friend_id: target_id}});
        },
        previous() {
            if (this.page > 1)
            {
                this.page -= 1;
                this.limit -= this.factor;
                this.prev -= this.factor;
            }
        },  
        next() {
            if(this.limit < this.match_display.length)
            {
                    this.page += 1;
                    this.limit += this.factor;
                    this.prev += this.factor;
            }


        },
    },
    computed: {
        historyDisplay() : Array<OneHistory>
        {
            return this.match_display;
        }
    }
})
</script>