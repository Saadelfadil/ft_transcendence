<template>
    <form @submit.prevent="joinPrivate">
    <div id="roompass_id">
        <div class="relative text-gray-600">
            <input 
            autoComplete="true" type="password" name="serch" placeholder="Password" class="bg-white h-10 px-5 pr-20 rounded-full text-sm focus:outline-none"
            v-model="user_room_pass"
            :class="{'bg-pink-500' : invalid_pass}"
            >
        </div>
    </div>
</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        invalid_pass:{
            type: Boolean,
            required: true
        }
    },
    emits: ['checkpass'],
    name: 'RoomPassPopUp',
    data(){
        return {
            user_room_pass: '' as string,
        }
    },
    methods: {
        joinPrivate()
        {
            console.log(`used with ${this.user_room_pass}`);
            this.$emit('checkpass', this.user_room_pass);
        }
    },

});
</script>