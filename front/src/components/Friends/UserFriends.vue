<template>
  <div>
  
  <div class="grid grid-cols-1 min-w-full">
    <ul class="overflow-auto" style="height: 90vh;">

        <div class="px-6">
          
          <div
            class="
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
              <button @click="removeFriend(login.id)" class='py-2 px-4 border-red-400 text-red-400 hover:shadow-lg rounded-md border'>Unfriend</button>
              <button @click="func('Block')" class='py-2 px-4 border-red-400 text-red-400 hover:shadow-lg rounded-md border'>Block</button>
              <button @click="func('Message')" class='py-2 px-4 border-blue-400 text-blue-400 hover:shadow-lg rounded-md border'>Message</button>
            </div>

          </div>
        </div>

    </ul>
  </div>
  </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import axios from 'axios';


export default defineComponent({
    name: 'FriendsBlock',
    data()
    {
        return {
            login : "ayghazal",
            user_id: 0 as number,
            logged: false as boolean,
            user : [] as Array<{id:number, login:string}>
        }
    },
    methods : {
      func(arg : string)
      {
        console.log(arg);
      },
      async checkLogin()
      {
          try{
              const resp = await axios({
                  method: 'get',
                  url: 'http://localhost:8080/api/islogin',
                  withCredentials: true
              });
              this.logged = true;
              this.user_id = resp.data.id;
          }
          catch(e)
          {
              this.logged = false;
          }
      },
      async getFriends()
      {
          try{
              const resp = await axios({
                  method: 'post',
                  url: 'http://localhost:8080/api/getfriends',
                  data: { id: this.user_id },
                  withCredentials: true,
              });
              this.user = resp.data;
          }
          catch(e)
          {
              this.logged = false;
          }
      },
      async removeFriend(_id:number)
      {
          try{
              const resp = await axios({
                  method: 'post',
                  url: 'http://localhost:8080/api/removefriend',
                  data: { user_id: this.user_id, friend_id: _id },
                  withCredentials: true,
              });

              
            this.user.map((req, index) => {
              if (req.id === _id)
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
    async created(){
      await this.checkLogin();
      if (!this.logged)
      {
          router.push({name: 'login'});
      }

      await this.getFriends();      
    }
})
</script>