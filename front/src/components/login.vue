<template>
    <div class="bg-slate-800  flex z-[1000] justify-center absolute top-0 right-0 bottom-0 left-0">
        <div class="flex flex-col justify-center">
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin&response_type=code">
        <button class="bg-blue-500 py-5 px-8 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
            LOGIN
        </button>
        </a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store';
import router from '@/router';
import axios from 'axios';


export default defineComponent({
    name: 'loginBlock',
    data(){
        return {
            logged: false as boolean
        }
    },
    methods: {
            async checkLogin(){

            try{
                const resp = await axios({
                method: 'get',
                url: 'http://localhost:8080/api/islogin',
                withCredentials: true,
                params: {
                    change: false
                }
                });
                this.logged = true;
            }catch(e){
                this.logged = false;
            }
        }
    },

    async created()
    {
        console.log(this.$router.options.history.state.back);
        // if (router.options.history.state.back === '/profile')
        // {
        //     console.log('inside');
        //     return ;
        // }
        // need to solve loop profile -> login login->profile ...
        if (this.$route.query.code !== undefined && this.$route.query.code !== null && this.$route.query.code !== "")
            {
                await axios({
                    method: 'post',
                    url: `http://localhost:8080/api/login`,
                    data: {
                        code: this.$route.query.code
                    },
                    // withCredentials: true
                }).then((response) => {
                    // this.getUserInfo();
                    router.replace({name : 'profile'});
                }, (error) => {
                    console.log(error);
                });
            }
            await this.checkLogin();
            if (this.logged)
            {
                router.replace({name: 'profile'});
            }
    }
});

</script>