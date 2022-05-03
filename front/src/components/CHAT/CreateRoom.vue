<template>

    <div
      class="flex flex-col items-center justify-center" style="height:90vh;"
    >
      <div
        class="
          flex flex-col
          bg-white
          shadow-md
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          py-8
          rounded-3xl
          w-50
          max-w-md
        "
      >


        <div class="mt-5">
          <form @submit.prevent="createRoom">
            <div class="flex flex-col mb-5">
              <label
                for="email"
                class="mb-1 text-xs tracking-wide text-gray-600"
                >Room Name:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
    
                </div>

                <input
                  id="text"
                  type="text"
                  name="text"
                  class="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                  :class="{'bg-pink-500' : invalid_name}"
                  v-model="room_name"
                  @keyup="userIsTyping($event, 0)"
                  @keypress="userIsTyping($event, 0)"
                  placeholder="Enter name room"
                />
              </div>
            </div>
            <div class="flex flex-col mb-6">
              <label
                for="password"
                class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >Password:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="true"
                  class="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                  :class="{'bg-pink-500' : inavlid_pass}"
                  v-model="room_password"
                    @keyup="userIsTyping($event, 1)"
                    @keypress="userIsTyping($event, 1)"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div class="flex w-full">
              <button
                class="
                  flex
                  mt-2
                  items-center
                  justify-center
                  focus:outline-none
                  text-white text-sm
                  sm:text-base
                  bg-blue-500
                  hover:bg-blue-600
                  rounded-2xl
                  py-2
                  w-full
                  transition
                  duration-150
                  ease-in
                "
              >
                <span class="mr-2 uppercase">create</span>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import store from '@/store';
import axios from 'axios';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CreateRoomBlock',
    data()
    {
        return {
            room_password: '' as string,
            room_name: '' as string,
            tmp_password: '' as string,
            tmp_name: '' as string,
            invalid_name: false as boolean,
            inavlid_pass: false as boolean,
      }
    },
    methods: {
        async createRoom()
        {
            this.tmp_name = this.room_name.trim();
            this.tmp_password = this.room_password.trim();
            if (this.tmp_name.length !== 0)
            {


				const resp = await axios.post(
					`http://localhost:3000/api/v1/room`,
					{
						"name": this.tmp_name,
						"locked": this.tmp_password.length > 0 ? true : false,
						"password": this.tmp_password
					},
					{
						headers: { Authorization: `Bearer ${localStorage.token}` }
					}
				);

	            if(!resp.data.status)
				{
					this.invalid_name = true;
                	this.inavlid_pass = true;
				}
				else
				{
					store.commit('addRoom', resp.data.roomData);
					router.push({name: 'chatpublic'});
				}
            }
			else
            {
                this.invalid_name = !this.tmp_name.length;
                this.inavlid_pass = !this.tmp_password.length;
            }

        },
        userIsTyping(e:any, index:number)
        {
            if (e.keyCode !== 13)
            {
                if (index === 0)
                    this.invalid_name = false;
                else
                    this.inavlid_pass = false;
            }
        }
    }
})
</script>


<style scoped>
.checked{
    display: block;
}
</style>