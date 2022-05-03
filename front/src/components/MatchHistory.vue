<template>
    <div>
    <div class="grid grid-cols-1 min-w-full border rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
                    <li>
                        <div class="px-6"
                        v-for="playerHist in playerHistory" :key="playerHist.history_id"
                        >
                        <div class="flex justify-around items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                                <div class="ml-2">
                                    <router-link :to="{name: 'temp'}">
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="getImg(playerHist.player_avatar_1)">
                                    </router-link>
                                </div>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="ml-2">
                                {{ playerHist.player_score_1 }} - {{ playerHist.player_score_2 }}
                                </div>
                            </div>

                            <div class="flex items-center">
                                <div class="ml-5">
                                    <router-link :to="{name: 'temp'}">
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="getImg(playerHist.player_avatar_2)">
                                    </router-link>
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
</template>


<script lang="ts">
import store from '@/store'
import { defineComponent } from 'vue'
import axios from 'axios'
export default defineComponent({
    name: 'LeaderBoardBlock',
    data()
    {
        return {
            msg: 'LeaderBoard here' as string
        }
    },
    created()
    {
        // now i will get players from backend
        this.initPlayerHistory();
    },
    methods:{
        getImg(player_avatar:string)
        {
            return require('../assets/' + player_avatar);
        },
        async initPlayerHistory()
        {
            const res = await axios.get('http://localhost:8004/playerHistory');
            store.commit('updatePlayerHistory', res.data);
        }
    },
    computed: {
        playerHistory(): Array<any>
        {
            return store.getters.getPlayerHistory;
        }
    }
})
</script>
