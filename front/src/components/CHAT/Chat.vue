<template>
    <div id="Chat_id">
        <ChatNavBarBlock />
<!-- 
        <PublicChatBlock v-show="isVisible === 0" />
        <PrivateChatBlock v-show="isVisible === 1" />
        <CreateRoomBlock v-show="isVisible === 2" /> -->

        <router-view />
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import ChatNavBarBlock from './chatnavbar.vue';
// import PublicChatBlock from './PublicChat.vue';
// import PrivateChatBlock from './PrivateChat.vue';
// import CreateRoomBlock from './CreateRoom.vue';
import store from '@/store';


export default defineComponent({
    name: 'ChatBlock',
    components: {
        ChatNavBarBlock,
        // PublicChatBlock,
        // PrivateChatBlock,
        // CreateRoomBlock,
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
