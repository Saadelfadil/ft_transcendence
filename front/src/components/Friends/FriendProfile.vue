<template>
    <div>
        <Navbar />

<div class="h-full mt-5">
 
  <div class="border-b-2 block md:flex">

    <div class="w-full p-4 sm:p-6 lg:p-8 bg-white shadow-md">
        <div class="flex justify-between">
            <span class="text-xl font-semibold block"> {{ user_name }} </span>
        </div>

        <div class="w-full p-8  mx-2 flex justify-center">
            <img class="rounded-full max-w-xs w-32 items-center border" :src="user_avatar">
        </div>
        <div class="w-full p-8 mx-2 flex justify-center">
        <div  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6">
            {{msg_status}}
        </div>
        <div  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
           Play
        </div>

        <div  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
           block
        </div>
        <div @click="addFriend" class="w-28  cursor-pointer bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6" v-if="!user_info.is_friend">
            Add
        </div>

        <router-link :to="{name: 'matchhistory', query: {history_id: $route.query.friend_id}}"  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
           history
        </router-link>
        
        </div>
        <p> Wins : {{user_info.wins}}</p>
        <p> Loses : {{user_info.loses}}</p>
    </div>
    

  </div>
 
</div>

    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Navbar from './Navbar.vue';
import router from '@/router';
import axios from 'axios';

interface FriendProfile{
    login:string;
    image_url:string;
    is_friend:boolean;
    wins:number;
    loses:number;
};


export default defineComponent({
  components: { Navbar },
    name: 'FriendProfile',
    data()
    {
        return {
            msg_status : "offline",
            user_id: 0 as number,
            logged: false as boolean,
            user_info: {login:'', image_url:'', is_friend:false, wins:0, loses:0} as FriendProfile
        }
    },
    computed: {
        user_avatar () : string {
            return this.user_info.image_url;
        },
        user_name() : string{
            return this.user_info.login;
        }
    },
    component : { // s
        Navbar,
    },
    methods: {
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

        async getExactUserData(_id:number) {
            try{
                const resp = await axios({
                    method: 'post',
                    data: {
                        friend_id:_id,
                        user_id:this.user_id    
                    },
                    url: 'http://localhost:8080/api/exactuser',
                    withCredentials: true
                });
                this.user_info = resp.data;
            }catch(e){
                console.log(e);
            }
        },
        async addFriend()
        {
            try{
                const resp = await axios({
                    method: 'post',
                    data: {
                        login: this.user_info.login,
                        user_id: this.user_id, 
                    },
                    url: 'http://localhost:8080/api/addfriend',
                    withCredentials: true
                });
                this.user_info.is_friend = true;
            }catch(e){
                console.log(e);
            }
        },
        validFriend(friend_id:number){
            if (this.user_id === friend_id)
            {
                router.replace({name: 'profile'});
                return ;
            }
        }
    },
    async created() {
        await this.checkLogin();
        if (!this.logged)
        {
            router.push({name: 'login'});
            return ;
        }
        this.validFriend(Number(this.$route.query.friend_id));
        await this.getExactUserData(Number(this.$route.query.friend_id));
    }

})
</script>