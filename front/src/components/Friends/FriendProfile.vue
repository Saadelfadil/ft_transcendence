<template>
    <div>
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
        <div  class="w-28 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6" :class="status_color">
            {{userStatus}}
        </div>
        <div  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="directMessage">
           message
        </div>

        <div v-if="UnblockedUser" class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="blockUser">
           block
        </div>
        <div v-if="!user_info.is_friend" class="w-28  cursor-pointer bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"  @click="addFriend">
            Add
        </div>

        <router-link :to="{name: 'matchhistory', query: {history_id: $route.query.friend_id}}"  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
           history
        </router-link>
        
        </div>
         <div class="w-full p-8 mx-2 flex justify-around">
        <div class="bg-green-500 rounded-lg font-bold text-white text-center px-4 py-3">
            wins: {{user_info.wins}}
        </div>
        <div class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3">
            Loses: {{user_info.wins}}
        </div>
        </div>
    </div>
    

  </div>
 
</div>

    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import router from '@/router';
import axios from 'axios';
import store from '@/store';


interface FriendProfile{
    login:string;
    image_url:string;
    is_friend:boolean;
    wins:number;
    loses:number;
    is_blocked:boolean;
};


export default defineComponent({
    name: 'FriendProfileBlock',
    data()
    {
        return {
            status_color : 'bg-blue-500',
            onlineUsers: [] as Array<number>,
            user_id: 0 as number,
            logged: false as boolean,
            user_info: {login:'', image_url:'', is_friend:false, wins:0, loses:0, is_blocked:false} as FriendProfile
        }
    },
    computed: {
        user_avatar () : string {
            return this.user_info.image_url;
        },
        user_name() : string{
            return this.user_info.login;
        },
        userStatus() : string {
            if (store.getters.get_in_game_users.includes(Number(this.$route.query.friend_id))){
                this.status_color = 'bg-yellow-500';
                return 'In Game';
            }
            if (store.getters.get_online_users.includes(Number(this.$route.query.friend_id)))
            {
                this.status_color = 'bg-green-500';
                return 'Online';
            }
            this.status_color = 'bg-blue-500';
            return 'Offline';
        },
        UnblockedUser() : boolean {
            return !this.user_info.is_blocked;
        }
    },
    methods: {
        async blockUser(){
            // logged user this.user_id
            // to be blocked this.$route.query.friend_id
            const resp = await axios({
                method: 'POST',
                url: 'http://localhost:8080/block',
                data: {
                    blocked: this.$route.query.friend_id,
                }
            });
            // assuming that backend is success
            this.user_info.is_blocked = true;
        },
    directMessage(){
        router.push({name: 'privatemsgs', query: {uId:this.$route.query.friend_id}});
        // what is the deff between message with friend and not
    },
        getExactUserData(_id:number) {
            return axios({
                    method: 'post',
                    data: {
                        friend_id:_id,
                        user_id:this.user_id    
                    },
                    url: 'http://localhost:8080/api/exactuser',
                    withCredentials: true,
                });
        },
        async addFriend()
        {
            console.log('adding');
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
        },
        isUserBlocked(){
			return axios({
				method: 'GET',
				url: `http://localhost:8080/block/${Number(this.$route.query.friend_id)}`
			});
		},
    },
    watch:{
        async user_id()
        {
            this.validFriend(Number(this.$route.query.friend_id));
            await Promise.all([this.isUserBlocked(), this.getExactUserData(Number(this.$route.query.friend_id))]).then((resps:Array<any>) =>{
                this.user_info = resps[1].data;
                this.user_info.is_blocked = resps[0].data.blocked; // do not move this linbe above
            });
        }
    }

})
</script>