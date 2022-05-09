<template>
    <!-- This is an example component -->
  <!-- Sidebar -->
      <nav class="bg-gray-900 w-20  justify-between flex flex-col ">
        <div class="mt-10 mb-10">
          <div class="mt-10">
            <ul>

              <li class="mb-6">
              <router-link :to="{name: 'profile'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500"  viewBox="0 0 24 24">
                      <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"></path>
                    </svg>
                  </span>
              </router-link>
              </li>

              <li class="mb-6">
                <router-link :to="{name: 'users'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500" viewBox="0 0 24 24">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </span>
                </router-link>
              </li>

              <li class="mb-6">
                <router-link :to="{name: 'leaderboard'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </router-link>
              </li>


              <li class="mb-6">
                <router-link :to="{name: 'matchhistory'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </span>
                </router-link>
              </li>

              <li class="mb-6">
                <router-link :to="{name: 'game'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </span>
                </router-link>
              </li>
              
              <!--<li class="mb-6">
                <router-link :to="{name: 'chat'}">
                  <span>
                    <svg class="fill-current h-8 w-8 mx-auto text-gray-300 hover:text-green-500" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    </span>
                  </router-link>
                </li> -->

            </ul>
          </div>
        </div>
          <div class="mb-4" @click="logout">
            <span>
              <svg
                class="fill-current h-5 w-5 text-gray-300 mx-auto hover:text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 4.00894C13.0002 3.45665 12.5527 3.00876 12.0004 3.00854C11.4481 3.00833 11.0002 3.45587 11 4.00815L10.9968 12.0116C10.9966 12.5639 11.4442 13.0118 11.9965 13.012C12.5487 13.0122 12.9966 12.5647 12.9968 12.0124L13 4.00894Z"
                  fill="currentColor"
                />
                <path
                  d="M4 12.9917C4 10.7826 4.89541 8.7826 6.34308 7.33488L7.7573 8.7491C6.67155 9.83488 6 11.3349 6 12.9917C6 16.3054 8.68629 18.9917 12 18.9917C15.3137 18.9917 18 16.3054 18 12.9917C18 11.3348 17.3284 9.83482 16.2426 8.74903L17.6568 7.33481C19.1046 8.78253 20 10.7825 20 12.9917C20 17.41 16.4183 20.9917 12 20.9917C7.58172 20.9917 4 17.41 4 12.9917Z"
                  fill="currentColor"
                />
              </svg>
            </span>
        </div>
      </nav>
</template>




<script lang="ts">

/**/

import { defineComponent, Prop } from 'vue'
import axios from 'axios';
import router from '@/router';
export default defineComponent({
    name: 'ManagerBlock',
    data()
    {
      return {
        state: 0 as number
      }
    },
    computed: {
      activeBtn() : number
      {
        return this.state;
      }
    },
    methods: {
      async logout()
      {
        await axios ({
          method: 'post',
          url: 'http://localhost:8080/api/logout'
        });
        router.replace({name: 'login'});
      }
    }
})

</script>

<style scoped>
.router-link-active span svg
{
  color: #48bb78;
}
</style>