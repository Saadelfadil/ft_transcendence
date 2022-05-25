<template>
<div>
	<div v-if="isPopUp">
		<div class="bg-slate-800 bg-opacity-50 flex z-[1000] justify-center absolute top-0 right-0 bottom-0 left-0">
			<div class="flex flex-col justify-center">
				<div class="bg-white px-10 py-8 rounded-md flex flex-col justify-between">

						<div class="flex-1 -mt-5 mb-5 -mr-5">
							<div class="flex justify-end">
								<svg @click="isPopUp = false;" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
								</svg>
							</div>
						</div>

					<button @click="profileClicked" class="mb-2 bg-sky-500 px-4 py-2 rounded-md text-md text-white">{{clicked_user_name}}</button>


					<div v-if="clickeduser_id != user_id" class="w-full">
						<div v-if="clickeduser_id != user_id" class="w-full">
							<button @click="inviteClicked" class="w-full mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Invite </button>
							<button v-if="((isAdmin && !roomInfo.admins.includes(clickeduser_id)) || isOwner) && !bannedUsers.includes(clickeduser_id)" @click="banClicked" class="w-full mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Ban</button>
							<button v-if="((isAdmin && !roomInfo.admins.includes(clickeduser_id)) || isOwner) && bannedUsers.includes(clickeduser_id)" @click="unBanClicked" class="w-full mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">unBan</button>
							<input  v-if="(isAdmin && !roomInfo.admins.includes(clickeduser_id)) || isOwner" v-focus class="w-full px-4 py-2 rounded-lg text-center mb-2 border-2 border-blue-500" :class="{'border-red-500' : invalidTime}" type="text" v-model="numOfSeconds" placeholder="seconds"/>
							<button v-if="(isAdmin && !roomInfo.admins.includes(clickeduser_id)) || isOwner" @click="muteClicked" class="w-full mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Mute</button>
						</div>

						<div v-if="isOwner" class="w-full">
							<button v-if=" !roomInfo.admins.includes(clickeduser_id) " @click="addAdmin" class="mb-2 w-full bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Set as admin</button>
							<button v-else @click="removeAdmin" class="mb-2 w-full bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Remove admin</button>
						</div>
					</div>
		
					
				
				</div>
			</div>
		</div>
	</div>

	<div class="flex-1 p:2 sm:p-6 justify-between flex flex-col" style="height:90vh;">



		<nav class="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full">

		<div class="mb-2 sm:mb-0 flex flex-row">
			{{ (roomInfo != null) ? roomInfo.name : '' }} <!-- will display room name username should be changed to roomName maybe -->
		</div>

		<div class="sm:mb-0 self-center">
			<button @click="leaveRoom" class="bg-blue-500 font-bold text-white  px-5 rounded">leave</button>
		</div>
		</nav>



	<div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
	</div>
	<div id="messages" v-godown  class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
		
		<div class="chat-message" v-for="(msg, index) in currentMsgs" :key="index">
			<div class="flex items-start" >
				
				<div class="px-5 my-2 text-gray-700 relative text-orange-500 cursor-pointer" @click="userIconClicked(msg)" style="max-width: 300px;">
					<img class="hidden sm:block w-full h-auto rounded-full max-w-xs w-32 items-center border w-14" loading="lazy" :src="msg.image_url" alt=""  style="margin: auto;">
					<span class="block text-center"> {{ msg.username }} </span>
				</div>
				<div class="bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative" style="max-width: 300px;">
					<span class="block"> {{ msg.msg }} </span>
					<span class="block text-xs text-right"> {{ timestampToDateTime(+msg.created) }} </span>
				</div>

				
	
			</div>
		</div>
	</div>


	<div class="px-4 pt-4 mb-2 sm:mb-0">
		<div class="relative flex">
			<input type="text" v-model="curMsgData" @keypress.enter="addMessage" placeholder="Write your message!" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-white-200 rounded-md py-3">
			<div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
				<button @click="addMessage"  type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
				<span class="font-bold">Send</span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
				</svg>
				</button>
			</div>
		</div>
	</div>
	</div>
</div>

</template>

<script lang="ts">

import store from '@/store';
import axios from 'axios';
import router from '@/router';
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import InviteBlock from './DirectPlay.vue';

interface message{
	id: number;
	room_id: number;
	from_id: number;
	image_url: string;
	username: string;
	msg: string;
	created: string;
}


export default  defineComponent({
   name: 'ChatPublicRoomMsg',
   components:{
	   'accept-or-decline': InviteBlock,
   },
   data()
   {
      return {
		socket: io(`http://${process.env.VUE_APP_HOST_IP}:3000/publicChat`),
		socket2 : io(`http://${process.env.VUE_APP_HOST_IP}:3000/privateChat`),
		user_id: 0 as number,
		clickeduser_id: 0 as number,
		ownerId: 0 as number,
		isOwner: false as boolean,
		isAdmin: false as boolean,
		numOfSeconds: '' as string,
		isPopUp: false as boolean,
        curMsgData: '' as string,
        roomId: Number(this.$route.query.roomId),
		username: '' as string,
		avatar: '' as string,
		roomInfo: null as any,
		invalidTime: false as boolean,
		blockedList: [] as Array<any>,
		bannedUsers: [] as Array<number>,
		clicked_user_name: '' as string,
      }
   },
	watch:{
		async user_id(){
			if (isNaN(this.roomId))
			{
				router.go(-1);
				return ;
			}
			this.chatStartUp();
			try{
				await Promise.all([this.getRoomsMessages(), this.getRoomsInfo(), this.getBannedUsers(), this.amIJoinedToThisRoom(), this.getBlockedList()]).then((resps:Array<any>) =>{
					if (!resps[3].data.status)
					{
						router.replace({name: 'chatpublic'});
						return ;
					}
					store.commit('updatePublicRoomMsgs', resps[0].data);
					this.roomInfo = resps[1].data;
					this.isAdmin = this.roomInfo.admins.includes(this.user_id);
					this.isOwner = (this.user_id == this.roomInfo.owner_id);
					this.ownerId = this.roomInfo.owner_id;
					this.bannedUsers = resps[2].data;
					if (resps[4].data !== undefined)
						this.blockedList = Array(resps[4].data);
				});
			}catch(e)
			{
				router.go(-1);
			}
		}
	},
   methods: {
	   amIJoinedToThisRoom(){
		   return axios({
			   method: 'POST',
			   url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/amijoinedtoroom`,
			   data: {room_id: this.roomId}
		   });
	   },
		getBlockedList(){
			return axios({
				method: 'GET',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/block/users`
			});
		},
	   chatStartUp(){
		   this.socket.on(this.roomId.toString(), ({ data }) => {
			   if (data.admin_id !== undefined)
			   {
				   if (data.add){
					   this.roomInfo.admins.push(data.admin_id); // just for front end so no need to refresh
				   }
					else{
						this.roomInfo.admins.map((cur_id:number, index:number) => {
							if (cur_id === data.admin_id)
							{
								this.roomInfo.admins.splice(index, 1);
								return ;
							}
						});
					}
					this.isAdmin = this.roomInfo.admins.includes(this.user_id);
			   }else{
				   this.newMessage(data);
			   }
		})
	   },
		getBannedUsers(){
			return axios({
				method: 'GET',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/ban/room/${this.roomId}/banned`,
			});
		},
		getRoomName(){
			if(this.user_id < this.clickeduser_id)
				return this.user_id+"-"+this.clickeduser_id;
			else
				return this.clickeduser_id+"-"+this.user_id;
		},
		getRoomQuery(){
			return (this.user_id > this.clickeduser_id) ? this.user_id.toString() + this.clickeduser_id.toString() : this.clickeduser_id.toString() + this.user_id.toString();
		},
		NewhandleSubmitNewInvite(clickedUserId: number){
			const messageData = {
				isInvite: true,
				inviteStatus: 0,
				from_id: this.user_id,
				to_id: clickedUserId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: ''
			};
			this.socket2.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
					if(response.status)
					{
						router.push({name : 'onevone', query: {room_name_1vs1: this.getRoomQuery(), pos: 'left'}});
					}
				}
			)
		},
	   handleSubmitNewMessage(msg:string){
		   
		   	const messageData = {
				   		isInvite: true,
						from_id: this.user_id,
						username: this.username,
						avatar: this.avatar,
						roomName: this.roomId.toString(),
						message: msg
					}

			this.socket.emit(
						'public-chat',
						{ 
							data: messageData
						},
					)
	   },
	   getRoomsInfo()
        {
			return axios({
				method: 'GET',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.roomId}`,
			});
        },
		getRoomsMessages()
        {
			return axios({
				method: 'GET',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.roomId}/messages`,
			});
        },
      addMessage()
      {
         const tmp = this.curMsgData.trim();
         if (tmp.length !== 0)
         {
			this.handleSubmitNewMessage(tmp);
			this.curMsgData = '';
         }
      },
	  	isUserBlocked(target_id:number){
			  let tmp : boolean = false;
			  this.blockedList.map((blocked_user:any) =>{
				  if (blocked_user[0] == target_id)
				  {
					  tmp = true;
					  return ;
				  }
			  });
			return tmp;
		},

	  newMessage(data: any)
      {
		if( !this.isUserBlocked(Number(data.from_id)) )
	  	{
			const msgObj = {
				id: data.id,
				room_id: this.roomId,
				from_id: data.from_id,
				username: data.username,
				image_url: data.avatar,
				msg: data.message,
				created: Date.now(),
			};
			this.curMsgData = '';
			store.commit('addMessageToRoomMsgs', msgObj);
		}
	  },
	  timestampToDateTime(unix_timestamp: number)
	  {
			var a = new Date(unix_timestamp);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
			return time;
	  },
	  leaveRoom()
	  {
		  axios({
			  method: 'POST',
			  url: `http://${process.env.VUE_APP_HOST_IP}:8080/room/leaveroom`,
			  data:{room_id: this.roomId}
		  }).then(({data}) =>{
			  if (data.status)
			  {
				  this.goBackToRoomsList();
			  }
		  });
	  },
	  goBackToRoomsList()
	  {
		  router.push({name: 'chatpublic'});
	  },
	  userIconClicked(msg:message)
	  {
		  	this.isPopUp = true;
			this.clickeduser_id = msg.from_id;
			this.clicked_user_name = msg.username;
		  	console.log(`message clicked`);
	  },
	  disablePopUp()
	  {
		  console.log('blured');
		  this.isPopUp = false;
	  },
	  profileClicked()
	  {
		  console.log(this.clickeduser_id);
		  if (this.user_id !== this.clickeduser_id)
		  {
			  router.push({name: 'FriendProfile', query: {friend_id: this.clickeduser_id}});
			return ;
		  }
		  router.push({name: 'profile'});
	  },
	  inviteClicked()
	  {
		  this.NewhandleSubmitNewInvite(this.clickeduser_id);
		  this.isPopUp = false;
	  },

	  async muteClicked()
	  {
		  if (Number.isInteger(+this.numOfSeconds) && +this.numOfSeconds > 0)
		  {
			  	// TODO : axios:
				//   if success
				const resp = await axios.post(
					`http://${process.env.VUE_APP_HOST_IP}:8080/ban`,
					{
						"banned": false,
						"room_id": this.roomId,
						"user_id": this.clickeduser_id,
						"duration": +this.numOfSeconds
					},
				);

				this.isPopUp = false;
				this.numOfSeconds = '';
				this.invalidTime = false;
		  }
		  else
		  {
			  this.invalidTime = true;
			  return ;
		  }
	  },
	  async banClicked()
	  {
		  	const resp = await axios.post(
				`http://${process.env.VUE_APP_HOST_IP}:8080/ban`,
				{
					"banned": true,
					"room_id": this.roomId,
					"user_id": this.clickeduser_id,
					"duration": 0,
					created: Date.now(),
				},
			);
		this.isPopUp = false;
		this.bannedUsers.push(this.clickeduser_id);
	  },
	  async unBanClicked(){
		const resp = await axios.delete(
			`http://l${process.env.VUE_APP_HOST_IP}:8080/ban/room/${this.roomId}/user/${this.clickeduser_id}`,
		);
		this.isPopUp = false;
		this.bannedUsers.map((id,index) => {
			
			if (id === this.clickeduser_id)
			{
				this.bannedUsers.splice(index, 1);
				return ;
			}
		})
	  },
	
	async addAdmin()
	{
		const resp = await axios.post(
			`http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.roomId}/add-admin`,
			{
				"user_id": this.clickeduser_id
			},
		);
		if(resp.data.status)
		{
			this.roomInfo.admins.push(this.clickeduser_id); // just for front end so no need to refresh
			this.isAdmin = true;
			this.isPopUp = false;
		}
		this.socket.emit(
					'admins-changed',{
						room_name: this.roomId.toString(), admin_id: this.clickeduser_id, add: true
					}
				)

	},
	async removeAdmin()
	{
		const resp = await axios.post(
			`http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.roomId}/remove-admin`,
			{
				"user_id": this.clickeduser_id
			},
		);

		if(resp.data.status)
		{
			this.roomInfo.admins.map((val:number, index:number) => {
				if (val === this.clickeduser_id){
					this.roomInfo.admins.splice(index, 1);
					this.isAdmin = false;
					return ;
				}
			});
			this.isPopUp = false;
		}
				this.socket.emit(
					'admins-changed',{
						room_name: this.roomId.toString(), admin_id: this.clickeduser_id, add: false
					}
				)

	}
   },
	unmounted(){
		this.socket.disconnect();
	},

   directives: {
      godown(box:any)
      {
         box.scrollTop = box.scrollHeight; // probably i will make call to async function to scroll down since until this line height is still old
      },
	focus : {
        mounted(el) {
            el.focus();
        },
    }
   },
   computed: {
      currentMsgs() : Array<message>
      {
         return store.getters.getMsgs;
      }
   }

})

</script>


<style scoped>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}

</style>
