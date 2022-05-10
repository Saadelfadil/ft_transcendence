<template>
    <div id="Chat_id">
        <ChatNavBarBlock />


        <router-view />
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import ChatNavBarBlock from './chatnavbar.vue';

import store from '@/store';


export default defineComponent({
    name: 'ChatBlock',
    components: {
        ChatNavBarBlock,
    },
    data()
    {
        return {
        }
    },
    methods: {
    },
    computed:{
        isVisible() : number
        {
            return store.state.chatState.index;
        }
    }
})
</script>
