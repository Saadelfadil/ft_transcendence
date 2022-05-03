<template>
    <div>
        level up
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LevelUpBlock',
     data(){
        return{
            //socket : io("http://localhost:3000/game") as any,
        }
    },
    methods: {
    },
    mounted(){
        console.log('levelup mounted');
    },
    unmounted(){
        console.log('level unmounted');
        // this.socket.emit("stopTime");
        // this.socket.disconnect();
    },
})
</script>
