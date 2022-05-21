<template>
  <div>
  
  <Navbar />
 
  <router-view />
  </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Navbar from './Friends/Navbar.vue';

export default defineComponent({
    name: 'UsersNavBarBlock',
    components : {
        Navbar,
    }
})
</script>