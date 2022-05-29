<template>
		<div class="bg-slate-800 bg-opacity-50 flex z-[1000] justify-center absolute top-0 right-0 bottom-0 left-0">
			<div class="flex flex-col justify-center">
				<div class="bg-white px-10 py-8 rounded-md flex flex-col justify-between">

                    <div class="flex-1 -mt-5 -mr-5">
                        <div class="flex justify-end">
                            <svg @click="roomSettingCancel"  xmlns="http://www.w3.org/2000/svg" class="cursor-pointer h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div class="text-center w-full mb-3">{{room_name}}</div>
                    <input :placeholder="input_place_holder" v-model="new_pass" @keypress="userIsTyping" @keyup="userIsTyping" v-focus class="w-full px-4 py-2 rounded-lg text-center mb-2 border-2 border-blue-500" :class="{'border-red-500' : invalid_pass}"  type="text" />

					<div class="w-full flex justify-between">
						<div class="">
							<button class=" mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white" @click="removeRoom"> remove </button>
						</div>
                        <div @click="updateRoomSetting">
							<button class=" mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white"> submit </button>
						</div>
					</div>

				</div>
			</div>
		</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        input_place_holder:{
            type: String,
            required: true
        },
        room_name: {
            type: String,
            required: true
        }
    },
    emits: ['update-room-password', 'remove-room', 'cancel-room-update'],
    name: 'RoomPassPopUpBlock',
    data(){
        return {
            new_pass: '' as string,
            invalid_pass: false as boolean,
        }
    },
    methods: {
        updateRoomSetting(){
            this.new_pass = this.new_pass.trim();
            this.$emit('update-room-password', this.new_pass);
        },
        removeRoom()
        {
            this.$emit('remove-room');
        },
        roomSettingCancel(){
            this.$emit('cancel-room-update', this.new_pass);
        },
        userIsTyping(e:any){
            if (e.keyCode !== 13) // 13 is for enter
                this.invalid_pass = false;
        },
    },
    directives:{
        focus : {
            mounted(el) {
                el.focus();
            },
        }
    }

});
</script>