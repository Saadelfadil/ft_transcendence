  
<template>
  <div>

    <div class="grid grid-cols-1 min-w-full">
      <ul class="overflow-auto" style="height: 90vh;">
          <div class="px-6"> 
            <div class=" flex justify-between h-30 p-4 my-6 rounded-lg border  border-gray-100 shadow-md"
              v-for="user in users" :key="user.id"
            >
              <router-link :to="{ name : 'FriendProfile'}">
                <p class='py-2 px-4 border-gray-900 text-gray-900 hover:shadow-md rounded-md cursor-pointer'>
                  {{ user.login }}
                </p>
              </router-link>
              
              <div class=" flex gap-x-4">
                <button @click="unblockUser(user.id)" class='py-2 px-4 border-red-400 text-red-400 hover:shadow-lg rounded-md border'>Unblock</button>
              </div>

            </div>
          </div>

      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios';

interface SingleUser{
  login:string;
  id:number;
}

export default defineComponent({
  name: 'IgnoreBlock',
  data() {
    return {
      user_id: 0 as number,
      login: "ayghazal" as string,
      userList : [] as Array<SingleUser>
    };
  },
  methods: {
    async unblockUser(blocked_user_id:number){
      const resp = await axios({
        method: 'DELETE',
        url: `http://localhost:8080/block`,
        data:{
          blocked: blocked_user_id
        }
      });
      this.userList.map((user:SingleUser, index:number) => {
        if (user.id === blocked_user_id)
        {
          this.userList.splice(index, 1);
          return ;
        }
      });
    },
    getBlockedList(){
			return axios({
				method: 'GET',
				url: `http://localhost:8080/block/users`
			});
		},
    getListUsers(users_ids:Array<number>){
      return axios({
        method: 'POST',
        url: `http://localhost:8080/api/listofusers`,
        data:{
          usersId: users_ids
        }
      });
    },
  },
  computed:{
    users() : Array<SingleUser> {
      return this.userList;
    }
  },
  watch:{
    async user_id(){
      this.getBlockedList().then((resp:any)=>{
          let blockedUsers : Array<number> = resp.data;
          this.getListUsers(blockedUsers).then((resp:any) => {
              this.userList = resp.data.users;
              console.log(this.userList);
          });
      });
    }
  }
});

</script>