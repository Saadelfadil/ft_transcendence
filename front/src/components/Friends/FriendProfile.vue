<template>
    <div>
        <Navbar />
<div class="h-full mt-5">
 
  <div class="border-b-2 block md:flex">

    <div class="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
        <div class="flex justify-between">
            <span class="text-xl font-semibold block"> {{ user.name }} </span>
        </div>

        <div class="w-full p-8  mx-2 flex justify-center">
            <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="user_avatar">
        </div>
        <div class="w-full p-8 mx-2 flex justify-center">
        <div  class="w-28 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
        :class="addStyle"
        >
            {{msg_status}}
        </div>
        <button  class="w-28 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer"
        >
           Play
        </button>
        <div  class="w-28  bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6" v-if="user.is_friend">
            Add
        </div>
        </div>
        <p> Wins : {{user.wins}}</p>
        <p> Loses : {{user.loses}}</p>
    </div>
    
    <div class="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
    <div class="grid grid-cols-1 min-w-full rounded">
                <ul class="overflow-auto hideScrollBar" style="height: 40vh;">
                    <li>
                        <div class="px-6"
                        v-for="players in user_history" :key="players.id"
                        >
                            <div class="flex justify-around items-center h-30 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
                            <div class="flex items-center">
                                <div class="ml-2">
                                        <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="user_avatar">
                                        <p class=' py-2 px-10 border-gray-900 text-gray-900 hover:shadow-md rounded-md cursor-pointer'>
                                            {{user.name}}
                                        </p>
                                </div>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="ml-2">
                                    {{players.score1}} - {{players.score2}}
                                </div>
                            </div>

                            <div class="flex items-center">
                                <div class="ml-5">
                                    <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="players.user2_avatar">
                                    <p class=' py-2 px-10 border-gray-900 text-gray-900 hover:shadow-md rounded-md cursor-pointer'>
                                        {{ players.login }}
                                    </p>
                                </div>
                            </div>
                            
                            <div>

                            </div>
                        </div>

                        </div>



                    </li>
                </ul>
    </div>

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


export default defineComponent({
  components: { Navbar },
    name: 'FriendProfile',
    data()
    {
        return {
            msg_status : "offline",
            user_id: 0 as number,
            logged: false as boolean,
            msg : "friendProfile component Helloooo",
            user : {
                wins: 5 as number,
                loses: 2 as number,
                avatar_url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80' as string,
                name: 'user name' as string,
                status: 0 as number, // 0  offling 1 online 2 in game,
                is_friend: false as boolean,
            },
            // user_history: [
            //     {
            //         id: 0 as number,
            //         user1_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user2_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user1_score: 1000 as number,
            //         user2_score: 10 as number,
            //     },
            //                   {
            //         id: 0 as number,
            //         user1_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user2_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user1_score: 1000 as number,
            //         user2_score: 10 as number,
            //     },
            //                   {
            //         id: 0 as number,
            //         user1_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user2_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user1_score: 1000 as number,
            //         user2_score: 10 as number,
            //     },
            //                   {
            //         id: 0 as number,
            //         user1_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user2_avatar: 'https://media.istockphoto.com/photos/rear-view-of-man-looking-at-city-in-sunlight-picture-id876576796?k=20&m=876576796&s=612x612&w=0&h=0IObpcqCk-i6atRIX8D0odOIVr7wIZfM6XgVosy67CI=' as string,
            //         user1_score: 1000 as number,
            //         user2_score: 10 as number,
            //     },
            // ]  as Array<any>,


            user_history : [] as Array<
                {id:number, score1:number, avatar:string, score2: number, login:string}
            >



        }
    },
    computed: {
        user_avatar () : string {
            return this.user.avatar_url;
        },
        addStyle() : string
        {
            if (this.user.status === 0)
                return 'bg-blue-500';
            else if (this.user.status === 1)
                return 'bg-green-500';          
            return 'bg-yellow-500';
        },
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

        async getFriendData(_id:number) {
            const resp = await axios({
                method: 'post',
                data: {
                    id: _id,
                    user_id: this.user_id
                },
                url: 'http://localhost:8080/api/getfrienddata',
                withCredentials: true
            });
        }
    },
    async created() {
        await this.checkLogin();
        if (!this.logged)
        {
            router.push({name: 'login'});
        }
        await this.getFriendData(Number(this.$route.query.friend_id));
    },

})
</script>

<style scoped>
.hideScrollBar::-webkit-scrollbar {
    display: none;
}

.hideScrollBar
{
    -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>