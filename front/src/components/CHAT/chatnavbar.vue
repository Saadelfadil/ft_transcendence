<template>
        <nav class="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full">
            <div class="sm:mb-0 self-center">
                <!-- <div class="h-10" style="display: table-cell, vertical-align: middle;"> -->
                <router-link :to="{name : 'chatpublic'}"
                    class="text-md no-underline text-black hover:text-blue-dark ml-2 px-1 cursor-pointer  inline-block" 
                >
                    Public
                </router-link>
                
                <router-link :to="{name : 'chatprivate'}" class="text-md no-underline text-grey-darker hover:text-blue-dark ml-2 px-1 cursor-pointer inline-block">
                    Private
                </router-link>
                <!-- <a href="/two" class="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">About Us</a> -->
                <router-link :to="{name : 'chatcreateroom'}" class="text-md no-underline text-grey-darker hover:text-blue-dark ml-2 px-1 cursor-pointer inline-block">
                    Create Room
                </router-link>
                <!-- </div> -->
            </div>
        </nav>
</template>


<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ChatNavBarBlock',

})
</script>


<style scoped>
                /* :class="{'text-rose-600': isVisible === 2}" */

.router-link-active
{
  color: #e11d48;
}
</style>