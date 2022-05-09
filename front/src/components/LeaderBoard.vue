<template>
            <div>
    <div class="grid grid-cols-1 min-w-full border rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
                    <li>
                        <div class="px-6"
                        v-for="player in players" :key="player.player_id"
                        >
                        <div class="flex justify-between items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">

                          
                                <div class="ml-2">
                                    <router-link :to="{ name : 'FriendProfile', query: {friend_id: 58640}}">
                                        <img :src="getImg(player.player_avatar)"   class="rounded-full max-w-xs w-16 items-center border" />
		                                <div class="text-center"> username </div>
                                    </router-link>
                                </div>
                                
                                <div class="flex flex-row ">
                                        <div class="bg-green-500 rounded-lg font-bold text-white text-center px-4 py-3 mr-5">
                                            wins: 1420
                                        </div>
                                        <div  class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3  ">
                                            loses : 45
                                        </div>
                                    </div>
                                <div>

                            <div class="rounded-lg font-bold text-center px-4 py-3  mr-6">
                                {{ player.player_score }}
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
import store from '@/store'
import { defineComponent } from 'vue'
import axios from 'axios'
import router from '@/router';

export default defineComponent({
    name: 'LeaderBoardBlock',
    data()
    {
        return {
            user_id: '' as string,
            logged: false as boolean,
            msg: 'LeaderBoard here' as string
        }
    },
    async created()
    {
        await this.checkLogin();
        if (!this.logged){
            router.push({name: 'login'});
            return ;
        }
        // now i will get players from backend
        this.initPlayers();
    },
    methods:{
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
        getImg(player_avatar:string)
        {
            return require('../assets/' + player_avatar);
        },
        async initPlayers()
        {
            const res = await axios.get('http://localhost:8003/players');
            store.commit('updatePlayers', res.data);
        }
    },
    computed: {
        players(): Array<any>
        {
            return store.getters.getPlayers;
        }
    }
})
</script>
