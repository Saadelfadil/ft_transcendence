<template>
        <nav class="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full">
            <div class="sm:mb-0 self-center">
                <!-- <div class="h-10" style="display: table-cell, vertical-align: middle;"> -->
                <router-link :to="{name: 'warmup'}" class="text-md no-underline text-black hover:text-blue-dark ml-2 px-1 cursor-pointer  inline-block">
                    WarmUp
                </router-link>
                
                <router-link :to="{name: 'matchup'}" class="text-md no-underline text-grey-darker hover:text-blue-dark ml-2 px-1 cursor-pointer inline-block"
                >
                    MatchUp
                </router-link>
                <!-- <a href="/two" class="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">About Us</a> -->
                <router-link :to="{name: 'levelup'}"  class="text-md no-underline text-grey-darker hover:text-blue-dark ml-2 px-1 cursor-pointer inline-block"
                >
                    LevelUp
                </router-link>
                
                <router-link :to="{name: 'stream'}"  class="text-md no-underline text-grey-darker hover:text-blue-dark ml-2 px-1 cursor-pointer inline-block"
                >
                    Stream
                </router-link>
                <!-- </div> -->
            </div>
        </nav>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'GameNavBarBlock',
    data(){
        return {
        }   
    },
})
</script>





<style scoped>
.router-link-active
{
    color: #e11d48;
}

</style>