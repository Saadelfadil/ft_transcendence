<template>

<div>
<div class="h-full" v-if="is_done && state === 0">
 
  <div class="border-b-2 block md:flex">

    <div class="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
        <div class="flex justify-between">
            <span class="text-xl font-semibold block">Your Info</span>
        </div>

        <div class="w-full p-8  mx-2 flex justify-center">
            <img id="showImage" class="rounded-full max-w-xs w-32 items-center border" :src="avatar_img" ref="image_upl">
        </div>
        <div class="w-full p-8 mx-2 flex justify-around">
        <div @click="promptChoosFile" class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
            <input style="display:none;" type="file" :maxFileSize="max_avatar_size" @change="avatarUpload" ref="input_file">
            change
        </div>
        <div @click="onUpload" class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
            upload
        </div>
        </div>
    </div>
    
    <div class="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
      <div class="rounded  shadow p-6">
        <div class="pb-6">
          <label for="name" class="font-semibold text-gray-700 block pb-1">Name</label>
          <div class="flex" @dblclick="editUserName">
            <!-- <input disabled id="username" class="border-1  rounded-r px-4 py-2 w-full" type="text" v-if="!user_name_editing" :value="user_info.user_name" /> -->
            <div class="px-4 py-2 w-full border border-gray-300 rounded-md" v-if="!user_name_editing">{{user_info.user_name}}</div>
            <input id="username" class="border-1  rounded-r px-4 py-2 w-full" placeholder="username" type="text" v-else v-focus :class="{'bg-red-600 bg-opacity-75' : invalid_user_name}" v-model="tmp_user_name" @keypress="userIsTyping" @keyup="userIsTyping" @blur="doneEditing(false)" @keypress.enter="doneEditing(true)"/>
          </div>
        </div>
        <div class="pb-4">
            <label class="flex justify-start items-start">
            <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                <input type="checkbox" class="opacity-0 absolute" @click="changeAuth">
                <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" :class="{checked : auth2_enabled}" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
            </div>
            <div class="select-none font-semibold text-gray-700"> enable authentication </div>
            </label>
        </div>
      </div>
        <div class="w-full p-8 mx-2 flex justify-around">
        <div class="bg-green-500 rounded-lg font-bold text-white text-center px-4 py-3">
            wins: {{user_info.wins}}
        </div>
        <div  class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3  ">
            loses : {{user_info.loses}}
        </div>
        <div @click="onUpload" class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer">
            <router-link :to="{name: 'matchhistory', query: {history_id: user_info.user_id}}">
                history
            </router-link>
        </div>
        </div>
    </div>
  </div>
    <div v-if="error_trigger" class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 mt-1 rounded-lg">
        <span class="block sm:inline">{{error_reason}}</span>
    </div>
</div>

<InitAuthBlock   :twof_qrcode="qr_image" @valid_auth="setAuth2" @cancel_signal="cancel_sig"  @change_auth_display="update_auth" :twof_secret="qr_secret" v-if="state === 1" />
</div>

</template>


<script lang="ts">

import { defineComponent } from 'vue'
import axios from 'axios';
import store from '@/store';

import InitAuthBlock from './auth/initAuth.vue';



export default defineComponent({
    name: 'ProfileBlock',
    components: {
        InitAuthBlock
    },
    data()
    {
        return {
            user_info: {
                user_name: '' as string,
                user_id: 0 as number,
                avatar_file_name: '' as string, /* i will place image in assets folder and avatar_url i will get it in from database*/
                avatar_file_obj: null as any,
                twof_qrcode: '' as string,
                twof_secret: '' as string,
                wins: 0 as number,
                loses: 0 as number,
            },
            error_reason: '' as string, 
            max_avatar_size: 10000 as number,
            auth2_enabled: false as boolean,
            invalid_user_name: false as boolean,
            invalid_image_upload: false as boolean,
            tmp_user_name: '' as string,
            user_name_editing: false as boolean,
            userInfoSendEndPoint: '' as string /* for example http://localhost:3000/upload */,
            logged: false as boolean,
            state: 0 as number, // change this to 0
            auth_switch: false as boolean,
            history_category: 0 as number,
        }
    },
    computed: {
        error_trigger() : boolean {
            return (this.invalid_user_name || this.invalid_image_upload);
        },
        avatar_img()
        {
            const img : string = this.user_info.avatar_file_name;
            return img;
        },
        is_done() : number
        {
            return this.user_info.avatar_file_name.length;
        },
        qr_image() : string
        {
            return this.user_info.twof_qrcode;
        },
        qr_secret() : string
        {
            return this.user_info.twof_secret;       
        }
    },
    methods:
    {
        async avatarUpload(event:any)
        {
            try {
                this.user_info.avatar_file_obj = await toBase64(event.target.files[0]);
            }catch (e:any)
            {
                console.error(e);
            }
        },
        async onUpload()
        {
            if (this.user_info.avatar_file_obj === null)
                return ;
            await axios({
                method: 'post',
                url: `http://localhost:8080/api/update`,
                data: {
                    login: null,
                    image_url: this.user_info.avatar_file_obj,
                    twof: null
                },
                withCredentials: true
            }).then((response) => {
                if (response.data.status)
                    this.user_info.avatar_file_name = response.data.image_url;
                else {
                    this.image_upload_failure();
                }
                this.user_info.avatar_file_obj = null;
            });
        },
        image_upload_failure(){
            this.error_reason = 'not able to upload maybe too big or not image';
            this.invalid_image_upload = true;
            setTimeout(() => {
                this.invalid_image_upload = false;
            },  2000);
        },
        promptChoosFile ()
        {
            const btn :any = this.$refs.input_file;
            btn.click();
        },
        editUserName()
        {
                console.log('catch double click');
                this.user_name_editing = true;
        },
        async doneEditing(edit:boolean)
        {
            if (edit === true)
            {
                let tmp = this.tmp_user_name.trim();
                if (tmp.length !== 0){
                    // here i should send to the backend to check if user name he typed is valid
                    if (tmp.length > 10){
                        this.tmp_user_name = '';
                        this.error_reason = 'must be less or equal 10 chars';
                        this.invalid_user_name = true;
                        return ;
                    }
                    // if valid i will update otherwise no
                    if (tmp !== this.user_info.user_name){
                        const check = await this.isUserNameValid(tmp);
                        if (check.value)
                            this.user_info.user_name = tmp;
                        else
                        {
                            this.tmp_user_name = '';
                            this.error_reason = 'not available username';
                            this.invalid_user_name = true;
                            return ;
                        }
                    } 
                }
                else
                {
                    if (tmp.length !== this.tmp_user_name.length)
                        this.error_reason = 'only spaces are not valid';
                    else
                        this.error_reason = 'can not be empty';
                    this.tmp_user_name = '';
                    this.invalid_user_name = true;
                    return ;
                }
            }
            this.user_name_editing = false;
            this.tmp_user_name = '';
            this.error_reason = 'username';
            this.invalid_user_name = false;
        },
        async isUserNameValid(userName:string){
            // simlation for getting data from db base and check if username already there 
            // request for check username
            let val: boolean = true;

            const resp = await axios({
                method: 'post',
                url: `http://localhost:8080/api/update`,
                data: {
                    login: userName,
                    image_url: null,
                    twof: null
                },
                withCredentials: true
            });
            return {value: resp.data.status};

        },
        userIsTyping(e:any){
            if (e.keyCode !== 13) // 13 is for enter
            {
                this.error_reason = 'username';
                this.invalid_user_name = false;
            }
        },
        async changeAuth()
        {
            // here i will change auth of user
            // until now i do not know what to do if response from backend was error what does it mean he could not change his authentication
            store.commit('set_auth2_enabled_DB', this.auth2_enabled);

            // this.auth2_enabled = !this.auth2_enabled;

            this.state = 1;
        },
        setAuth2(val:boolean){
            this.state = 0;
            this.auth2_enabled = val;
            console.log(`change auth ${val}`);
        },
        cancel_sig()
        {
            console.log('called');
            this.state = 0;
        },
        update_auth(authData:any){
            this.user_info.twof_qrcode = authData.twof_qrcode;
            this.user_info.twof_secret = authData.twof_secret;

        },
        async getUserInfo()
        {

            try {
                await axios({
                    method: 'get',
                    url: `http://localhost:8080/api/user`,
                    withCredentials: true
                }).then((response) => {
                    this.user_info.avatar_file_name = response.data.image_url;
                    this.user_info.avatar_file_obj = null;
                    this.user_info.user_name = response.data.login;
                    this.user_info.user_id = response.data.id;
                    this.auth2_enabled = response.data.twof;
                    store.commit('set_auth2_enabled_DB', this.auth2_enabled);
                    this.user_info.twof_qrcode = response.data.twof_qrcode;
                    this.user_info.twof_secret = response.data.twof_secret;
                    this.user_info.wins = response.data.wins;
                    this.user_info.loses = response.data.loses;
                }, (error) => {
                    console.log(error);
                });
            }
            catch(e)
            {
                console.error('error happend');
            }
        }
    },
    directives:
    {
        focus : {
            mounted(el) {
                el.focus();
            },
        }
    },
    watch: {
        async user_id(){
            await this.getUserInfo();
            store.commit('set_verify', this.auth_switch && this.auth2_enabled);
            if (this.auth2_enabled && this.auth_switch) {
                this.state = 1;
            }
        },
        state()
        {
            if (this.state === 1)
            {
                store.commit('set_prev_auth', this.auth2_enabled); 
            }
        }
    }
})

const toBase64 =(file:any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


</script>

<style scoped>
.checked{
    display: block;
}
</style>