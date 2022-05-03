<template>
    <div id="Chat_id">
        <GameNavBarBlock />

        <!-- <WarmUpBlock v-show="isVisible === 0" />
        <MatchUpBlock v-show="isVisible === 1" />
        <LevelUpBlock v-show="isVisible === 2" /> -->
        <router-view />
        
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import GameNavBarBlock from './gamenavbar.vue';
// import WarmUpBlock from './WarmUp.vue'
// import MatchUpBlock from './MatchUp.vue'
// import LevelUpBlock from './LevelUp.vue'
// import store from '@/store';

export default defineComponent({
    name: 'GameBlock',
    components: {
        GameNavBarBlock,
        // WarmUpBlock,
        // MatchUpBlock,
        // LevelUpBlock
    },
    // data()
    // {
    //     return {
    //     }
    // },
    // methods: {
        
    // },
    // computed:{
    //     isVisible() : number
    //     {
    //         return store.state.gameState.index;
    //     }
    // }
})
</script>
