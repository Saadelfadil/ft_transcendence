<template>
  
  <div>

  <div class="grid grid-cols-1 min-w-full">
    <ul class="overflow-auto" style="height: 90vh;">

        <div class="px-6">
          
          <div class="
              flex
              justify-between
              
              h-30
              p-4
              my-6
              rounded-lg
              border  border-gray-100
              shadow-md
            "
            v-for="login in user" :key="login.id"
          >
          <router-link :to="{ name : 'FriendProfile', query: {friend_id: login.id}}">
            <p class='py-2 px-4 border-gray-900 text-gray-900 hover:shadow-md rounded-md cursor-pointer'>
              {{ login.login }}
            </p>
          </router-link>
            
            <div class=" flex gap-x-4">
              <button @click="acceptOrDecline(true, login.id)" class='py-2 px-4 border-blue-400 text-blue-400 hover:shadow-lg rounded-md border'>Accept</button>
              <button @click="acceptOrDecline(false, login.id)" class='py-2 px-4 border-red-400 text-red-400 hover:shadow-lg rounded-md border'>Decline</button>
            </div>
          </div>
        </div>

    </ul>
    
  </div>
  </div>
  

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router';
import axios from 'axios';


export default defineComponent({
    name: 'RequestsBlock',
    data()
    {
        return {
          logged: false as boolean,
          login : "ayghazal" as string,
          user_id: 0 as number,
          user : [] as Array<{id: number, login:string}>
        }
    },
    methods : {
      async getFriendsRequest()
      {
          try{
              const resp = await axios({
                  method: 'post',
                  url: `http://localhost:8080/api/getrequests`,
                  data: { id: this.user_id },
                  withCredentials: true,
              });
              this.user = resp.data;
              console.log(resp.data);
          }
          catch(e)
          {
              console.log(e);
          }
      },
      async acceptOrDecline(val:boolean, id:number)
      {
        try{
          const resp = await axios({
              method: 'post',
              data: {
                is_accept: val,
                request_user_id: id
              },
              url: `http://localhost:8080/api/requesttofriend`,
              withCredentials: true
          });
          this.user.map((req, index) => {
            if (req.id === id)
            {
              this.user.splice(index, 1);
              return ;
            }
          });
        }
        catch(e)
        {
            console.log(e);
        }
      },
    },
    watch:{
      async user_id(){
          await this.getFriendsRequest();  
      }
    }
})
</script>