<template>
  <div class="flex flex-row h-full">
    <ManagerBlock />
    <div class="px-16 py-4 text-gray-700 bg-gray-200 h-screen w-screen">
        <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store';
import io from 'socket.io-client';

import ManagerBlock from './components/manager.vue';

export default defineComponent({
	name: 'MainAppBlock', // be carful here
  components: {
    ManagerBlock,
  },
  data(){
    return {
      socket : io(`http://${process.env.VUE_APP_HOST_IP}:3000/onlineUsers`) as any,
    }
  },


  computed:{
    GoOnline() : boolean {
      return store.getters.get_global_user_id;
    }
  },

  watch:{
    GoOnline(){
			this.socket.emit('online-state',  { user_id: store.getters.get_global_user_id}, (response: any) => {
            store.commit('set_online_users', response.onlineUsers);
            store.commit('set_in_game_users', response.inGameUsers);
      });
      this.socket.on("online-users", (data:any) => {
            store.commit('set_online_users', data);
      });
      this.socket.on('all-users-in-game', (data:any) => {
        store.commit('set_in_game_users', data);
      });
    }
  },
})
</script>
