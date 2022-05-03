<template>
            <div>
    <div class="grid grid-cols-1 min-w-full border rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 90vh;">
                    <li>
                        <div class="px-6"
                        v-for="player in players" :key="player.player_id"
                        >
                        <div class="flex justify-between items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                                <div class="ml-2">
                                    <router-link :to="{name: 'temp'}">
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="getImg(player.player_avatar)">
                                    </router-link>
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
        this.initPlayers();
    },
    methods:{
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
