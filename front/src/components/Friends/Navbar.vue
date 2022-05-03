<template>
    

    <nav class="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full">
        <div class="sm:mb-0 self-center">    
           
           <router-link :to="{ name : 'users'}">
            <div
                class="text-md no-underline text-grey-darker hover:text-green-500 ml-2 px-1 cursor-pointer  inline-block"
             >
                Friends
            </div>
            </router-link>

            <router-link :to="{ name : 'Requests'}">
            <div  
            class="text-md no-underline text-grey-darker hover:text-green-500 ml-2 px-1 cursor-pointer inline-block"
            >
                Requests
            </div>
            </router-link>

            <router-link :to="{ name : 'Ignore'}">
            <div
            class="text-md no-underline text-grey-darker hover:text-green-500 ml-2 px-1 cursor-pointer inline-block"
            >
                Ignore
            </div>
            </router-link>

            <router-link :to="{ name : 'Add'}">
            <div 
            class="text-md no-underline text-grey-darker hover:text-green-500 ml-2 px-1 cursor-pointer inline-block"
            >
                Add Friends
            </div>
            </router-link>   
        </div>
    </nav>

</template>



<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    name : 'Navbar',
    data() {
        return {

        }    
    },
})
</script>
