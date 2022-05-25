<template>

    <div>

    <h3 class="px-4 pt-8">Play with Friends it's more fun!</h3>

    <div>
    <form class="m-4 flex" @submit.prevent="submit">
        <input v-model="username_"   @keypress="userIsTyping" @keyup="userIsTyping" class="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white" placeholder="Enter Login"/>
        <button class="px-8 rounded-r-lg bg-green-500  text-gray-800 font-bold p-4 uppercase border-white border-t border-b border-r">Search</button>
    </form>
    </div>

    <p class="px-4 pt-4 text-red-500">
        {{msg}}
    </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router';
import axios from 'axios';


export default defineComponent({
    name: 'AddBlock',
    data()
    {
        return {
            logged: false as boolean,
            user_id: 0 as number,
            username_: "" as string,
            msg : "" as string
        }
    },
    methods : {
        async submit() {
            if (this.username_.trim().length > 0)
            {
                // send username_ to Endpoint;
                const resp = await axios({
                    method: 'post',
                    data: { login: this.username_ },
                    url: `http://localhost:8080/api/userbylogin`,
                    withCredentials: true
                });
                if (!resp.data.status){
                    this.msg = "Please Enter a Valid Input!!";
                } else {
                    if (resp.data.id === this.user_id)
                    {
                        // means that you have searched for yourself
                        router.push({name: 'profile'});
                    } else {
                        router.push({name : 'FriendProfile', query: {friend_id: resp.data.id}});
                    }
                }
            }
            else
            {
                this.msg = "Please Enter a Valid Input!!";
            }
            this.username_ = "";
        },
        userIsTyping(e:any){
            if (e.keyCode !== 13) // 13 is for enter
                this.msg = "";
        },
    },

})
</script>