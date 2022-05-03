<template>
    <div id="game_id">
        {{msg}}
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'GameBlock',
    data()
    {
        return {
            msg: 'game here'
        }
    }
})
</script>
