<template>
    <div class="flex flex-col items-center rounded-lg  mt-3" style="height:50vh;">
            <div class="flex items-center rounded-lg  h-full">
                <div @click="startPressed"  class="bg-blue-500 rounded-lg font-bold text-white text-center px-8 py-5 transition duration-300 ease-in-out hover:bg-blue-600 cursor-pointer">
                        Start
                </div>
            </div>
        </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    emits: ['startPlaying'],
    methods: {
        startPressed(){
            this.$emit('startPlaying');
        }
    }
})
</script>
