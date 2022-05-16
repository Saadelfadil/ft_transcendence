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
      user_id: 0 as number,
      socket : io("http://localhost:8009"),
    }
  },
  methods:{
  },
  watch:{
    user_id(){
			(this).socket.emit('online', { data: { userId: (this).user_id } }, (response: any) => {
            let newArray: Array<number> = [];
            for (let user in response.onlineUsers) {
                newArray.push(response.onlineUsers[user]);
                
            }
            store.commit('set_online_users', newArray);
      });
      this.socket.on("onlineUsers", (data) => {
            let newArray: Array<number> = [];
            for (let user in data) {
                newArray.push(data[user]);
                
            }
            store.commit('set_online_users', newArray);
      });
    }
  }
})
</script>
