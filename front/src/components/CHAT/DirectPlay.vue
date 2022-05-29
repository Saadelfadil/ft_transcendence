<template>
	<div flex="w-full">
		<div class="w-full p-2  flex justify-around bg-white rounded-lg">
			<div class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="acceptInvite">
				accept
			</div>
			<div class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="declineInvite">
				decline
			</div>
		</div>
	</div>

</template>


<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'InviteBlock',
    methods: {
        acceptInvite(){
            //console.log("accept playing");
        },
        declineInvite(){
            //console.log("decline playing");
        },
    }
})
</script>