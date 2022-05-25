<template>
    <!-- <div> -->
    <div class="grid grid-cols-1 min-w-full border rounded">
        <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
            <li>
                <div class="px-6"
                v-for="(leader,index) in leaders" :key="leader.id" 
                >
                    <div v-if="index >= prev && index < limit" class="flex justify-between items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                        <div class="ml-2">
                            <router-link :to="{ name : 'FriendProfile', query: {friend_id: leader.id}}">
                                <img :src="leader.image_url"   class="rounded-full max-w-xs w-16 items-center border" />
                                <div class="text-center"> {{leader.login}} </div>
                            </router-link>
                        </div>
                            <div class="flex flex-row ">
                                    <div class="bg-green-500 rounded-lg font-bold text-white text-center px-4 py-3 mr-5">
                                        wins: {{leader.wins}}
                                    </div>
                                    <div  class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3  ">
                                        loses : {{leader.loss}}
                                    </div>
                            </div>
                            <div>
                                <div class="rounded-lg font-bold text-center px-4 py-3  mr-6">
                                    {{ leader.points}}
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
    <!-- </div> -->
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface Leader{
    id:number;
    login: string;
    image_url: string;
    wins:number;
    loss:number;
    points:number;
}

export default defineComponent({
    name: 'LeaderBoardBlock',
    data()
    {
        return {
            user_id: '' as string,
            logged: false as boolean,
            all_leaders: [] as Array<Leader>,

            page : 1 as number,
            prev: 0 as number,
            factor : 5 as number,
            limit :5 as number,
        }
    },
    async created()
    {
        await this.initPlayers();
    },
    methods:{
        async initPlayers()
        {
            try{
                const resp = await axios({
                    method: 'GET',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/users`
                });
                this.all_leaders = resp.data;
            }catch(e){
                console.log(e);
            }
        },
        previous() {
            if (this.page > 1)
            {
               this.page -= 1;
               this.limit -= this.factor;
               this.prev -= this.factor;
               console.log('previous');
            }
        },  
        next() {
            if(this.limit < this.all_leaders.length)
            {
                    this.page += 1;
                    this.limit += this.factor;
                    this.prev += this.factor;
                    console.log('next');
            }


        },
    },
    computed: {
        leaders() : Array<Leader> {
            return this.all_leaders.sort((a, b) => {
                let win = b.wins - a.wins;
                return (win === 0) ? b.points - a.points : win;
            });
        }
    }
})
</script>
