<template>
<!-- background -->
<div class="relative flex min-h-screen flex-col justify-center  from-rose-100 to-teal-100">
  <!-- card -->

  <div class="mx-auto flex py-5 px-20 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-slate-300/60 divide-y">
    <!-- img -->
    <div v-if="disableAuth">
        <div class="flex  justify-center mt-5 font-mono text-center">
            Please use your authentication app ( Google Authenticator ) to scan this QR code.
        </div>

        <div class="flex justify-center mt-5">
            <div>
                <img class="w-[20rem]" :src="twof_qrcode" />
            </div>
        </div>

        <div class="flex  justify-center mt-5 mb-5 font-bold">
            {{twof_secret}}
        </div>

    </div>

    <div>
        <div class="flex justify-center text-center mt-5 mb-5 font-mono">
                To confirm the third party app is set up correctly, enter the security code that appears on your app.
        </div>
        <div class="max-w-sm mx-auto p-1 pr-0 flex items-center">
            <input type="text" maxlength="6" @keypress.enter="submit" @keypress="userIsTyping" @keyup="userIsTyping" v-model="input_code" placeholder="Enter the 6-digit code" class="flex-1 appearance-none rounded shadow p-3 text-grey-dark mr-2 focus:outline-none" :class="{'bg-red-500 placeholder-white' : !valid_code}">
            <button @click="submit" type="submit" class="appearance-none  text-base font-semibold tracking-wide uppercase text-white bg-blue-500 mr-3 p-3 rounded shadow hover:bg-indigo-light">submit</button>
            <button @click="cancel" v-if="cancelVisible" type="submit" class="appearance-none  text-base font-semibold tracking-wide uppercase text-white bg-blue-500 p-3 rounded shadow hover:bg-indigo-light">cancel</button>
        </div>
    </div>


  </div>


</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import router from '@/router';
import store from '@/store';
export default defineComponent({
    emits: ['valid_auth', 'cancel_signal', 'change_auth_display'],
    data(){
        return {
            input_code: '' as string,
            valid_code : true as boolean,
            logged: false as boolean,
        }
    },

    props: {
        twof_qrcode: String,
        twof_secret: String
    },
    name: 'InitAuthBlock',
    computed: {
        cancelVisible()
        {
            return !store.getters.get_verify;
        },
        disableAuth()
        {
            if (!store.getters.get_verify)
            {
                return !store.getters.get_prev_auth;
            }else
                return false;
        }
    },
    methods :{
        async submit()
        {
            this.input_code = this.input_code.trim();
            if (this.input_code.length !== 0 && isNaN(this.input_code.length) === false)
            {
                await axios({
                method: 'post',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/validate`,
                data: {
                    twof_qrcode: this.input_code,
                    change: store.getters.get_verify,
                    twof: !store.getters.get_prev_auth
                },
                withCredentials: true
                }).then(async (response) => {
                    this.valid_code = response.data.success;
                    if (this.valid_code)
                    {
                        let sig = store.getters.get_verify;
                        if (!sig)
                            sig = !store.getters.get_prev_auth;
                        store.commit('set_verify', false);
                        // await this.changeDBAuth();
                        if (!sig)
                        {
                            this.$emit('change_auth_display', {twof_qrcode: response.data.twof_qrcode, twof_secret: response.data.twof_secret});
                        }
                        this.$emit('valid_auth',  sig);
                    }
                });
            }
            else
            {
                this.valid_code = false;
            }
        },
        async cancel ()
        {
            // we need to chage qr picture if cancel was success
            if (this.logged)
            {
               this.$emit('cancel_signal'); 
               return ;
            }
            if (!store.getters.get_auth2_enabled_DB){
                this.$emit('valid_auth', false);
                return ;
            }
            try{
                const resp = await axios({
                    method: 'post',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/logout`,
                    withCredentials: true
                });
                router.replace({name : 'login'});
            }
            catch(e)
            {
                ////console.log(e);
            }
        },
        userIsTyping(e:any){
            if (e.keyCode !== 13)
                this.valid_code = true;
        },
        async changeDBAuth()
        {
            await axios({
                method: 'post',
                url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/update`,
                data: {
                    login: null,
                    image_url: null,
                    twof: !store.getters.get_auth2_enabled_DB
                },
                withCredentials: true
            });

        }
    }

})
</script>
