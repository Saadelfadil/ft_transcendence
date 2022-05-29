<template>
    <div id="Chat_id">
        <GameNavBarBlock />


        <router-view />
        
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import GameNavBarBlock from './gamenavbar.vue';


export default defineComponent({
    name: 'GameBlock',
    components: {
        GameNavBarBlock,
    },

})
</script>
