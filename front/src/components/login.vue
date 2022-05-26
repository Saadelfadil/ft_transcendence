<template>
    <div class="bg-slate-800  flex z-[1000] justify-center absolute top-0 right-0 bottom-0 left-0">
        <div class="flex flex-col justify-center">
        <a v-if="!is_logged" href = "https://api.intra.42.fr/oauth/authorize?client_id=3a392de18612a23eab4db59491af2179c5df757d6278ff42963fefef79dc19a7&redirect_uri=http%3A%2F%2F10.12.1.5%3A8080%2Flogin&response_type=code">
            <button class="bg-blue-500 py-5 px-8 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
                LOGIN
            </button>
        </a>
        <router-link :to="{name: 'profile'}" v-else class="bg-blue-500 py-5 px-8 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store';
import router from '@/router';
import axios from 'axios';


export default defineComponent({
    name: 'LoginBlock',
    data(){
        return {
            is_logged: false as boolean,
        }
    },
    methods: {
            async redirectIfLogged(){
            const resp = await axios({
                method: 'get',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/islogin`,
                withCredentials: true,
            });
            this.is_logged = resp.data.status;
        }
    },

    async created()
    {
        if (this.$route.query.code !== undefined && this.$route.query.code !== null && this.$route.query.code !== "")
        {
            await axios({
                method: 'post',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/login`,
                data: {
                    code: this.$route.query.code
                },
                // withCredentials: true
            }).then((response) => {
                router.replace({name : 'profile'});
            }, (error) => {
                console.log(error);
            });
        }
        console.log(process.env.VUE_APP_HOST_IP, "fgdfgdfgdfgdf");
        await this.redirectIfLogged();
    }
});

</script>