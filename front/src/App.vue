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
import axios from 'axios';

import ManagerBlock from './components/manager.vue';

export default defineComponent({
	name: 'MainAppBlock', // be carful here
  components: {
    ManagerBlock,
  },
//   data()
//   {
// 	  return {
// 			token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5NjE3MDQ1LCJleHAiOjE2NTIyMDkwNDV9.wI-kuAjS-PDo43WRL0MaZpNKVkBxW5QvYIXxMK0oz5Y',
// 			user_id: 0 as number,
// 	  }
//   },
// //   created(){
// // 	  console.log("in app");
// // 	   this.persist();
// //    },
//    watch: {
// 	   user_id(){
// 		   if (this.user_id !== 0)
// 		   	this.persist();
// 	   }
//    },
//   methods: {
//     async persist() {

// 		try {

// 			const resp = await axios.get(
// 				`http://localhost:8080/users/${String(this.user_id)}/current`,
// 			);
// 			const data = resp.data;
// 			localStorage.token = this.token;
// 			localStorage.userId = data.id;
// 			localStorage.username = data.username;
// 			localStorage.avatar = data.avatar;
// 			localStorage.joinedRooms = data.joinedRooms;
// 		}
// 		catch(e)
// 		{
// 			console.log(`while trying to get data for rooms ${e}`);
// 		}
//     }
//   },
})
</script>
