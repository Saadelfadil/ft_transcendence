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

						<button @click="profileClicked" class="mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Profile</button>


						<div v-if="clickeduser_id != user_id" class="w-full">
							<button @click="inviteClicked" class="w-full mb-2 bg-indigo-500 px-4 py-2 rounded-md text-md text-white">Invite </button>
						</div>
		
						
					
					</div>
				</div>
			</div>
		</div>

		<div class="flex-1 p:2 sm:p-6 justify-between flex flex-col" style="height:90vh;">


		<div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
		</div>
		<div id="messages" v-godown  class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
			
			<div class="chat-message" v-for="(msg, index) in currentMsgs" :key="index">
				<div class="flex items-start" >
					<div class="px-5 my-2 text-gray-700 relative text-orange-500 cursor-pointer" @click="userIconClicked(msg)" style="max-width: 300px;">
						<img class="hidden sm:block w-full h-auto rounded-full max-w-xs w-32 items-center border w-14" loading="lazy" :src="msg.image_url" style="margin: auto;">
						<span class="block text-center"> {{ msg.username }} </span>
					</div>

					<div v-if="!msg.isInvite" class="bg-gray-100 rounded px-5 py-2 my-2 text-gray-700 relative" style="max-width: 300px;">
						<span class="block"> {{ msg.msg }} </span>
						<span class="block text-xs text-right"> {{ timestampToDateTime(+msg.created) }} </span>
					</div>

					<div v-else-if="msg.inviteStatus === 0" flex="w-full">
						<div class="w-full p-2  flex justify-between bg-white rounded-lg">
							<div class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="acceptInvite(msg, index)">
								accept
							</div>
							<div class="bg-red-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600  cursor-pointer" @click="declineInvite(msg, index)">
								decline
							</div>
						</div>
					</div>

					<div v-else-if="msg.inviteStatus === 1" flex="w-full">
						<div class="w-full p-2  flex items-center bg-white rounded-lg">
							<div class="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 cursor-pointer" @click="directPlay(msg)">
								Play
							</div>
						</div>
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



interface message{
	id: number;
	room_id: number;
	to_id:number;
	from_id: number;
	image_url: string;
	username: string;
	msg: string;
	created: string;
	inviteStatus: number;
    isInvite: boolean;
}


export default  defineComponent({
   name: 'PrivateMsgsBlock',
   data()
   {
      return {
		socket : io(`http://${process.env.VUE_APP_HOST_IP}:3000/privateChat`),
		clickeduser_id: 0 as number,
		ownerId: 0 as number,
		isOwner: false as boolean,
		isAdmin: false as boolean,
		numOfSeconds: '' as string,
		isPopUp: false as boolean,
        curMsgData: '' as string,
        uId: Number(this.$route.query.uId), // probably means friend id that you are talking to
		roomId: 1,
		token: '' as string,
		user_id: 0,
		username: '' as string,
		avatar: '' as string,
		joinedRooms: [] as Array<number>, // i do not know why this var is here
		blockedList: [] as Array<number>,
		roomInfo: null as any,
		invalidTime: false as boolean,
      }
   },

	watch:{
		async user_id(){
			if (isNaN(this.uId))
			{
				router.go(-1);
				return ;
			}
			try{
				await Promise.all([this.getJoinedRooms(), this.getBlockedList()]).then(
					(output:Array<any>) => {
						this.joinedRooms = Array(output[0].data.joinedRooms);
						this.blockedList =  Array(output[1].data);
					}
				);
			}catch(e){
				router.go(-1);
			}
			await this.getUserMessages();
			this.acceptingMsg();
		},
	},
   methods: {
		getJoinedRooms(){
			return axios({
				method: 'POST',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/joinedRooms`,
                data: {id:this.user_id}
			});
		},
		getBlockedList(){
			return axios({
				method: 'GET',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/block/users`
			});
		},
		async getUserMessages()
        {
			// console.log(`display blocked list ${this.blockedList}`)
            const resp = await axios.get(
				`http://${process.env.VUE_APP_HOST_IP}:8080/messages/${this.uId}`,
			);
            const data = resp.data;
			let newArray = [];
			for (let i = 0; i < data.length; ++i) {
				if( 
					data[i].isInvite == false ||
					(data[i].isInvite == true &&  data[i].inviteStatus == 0 && data[i].to_id == this.user_id ) ||
					(data[i].isInvite == true &&  data[i].inviteStatus == 1 && data[i].from_id == this.user_id )
				)                      
				{
					newArray.push(data[i]);
				}
				
			}


			
			store.commit('updatePublicRoomMsgs', newArray);
        },
		joinedAndBlocked(){
			axios({
				method: 'get',
				url: `http://${process.env.VUE_APP_HOST_IP}:8080/messages/${this.uId}`
			});
		},
    addMessage()
    {

        const tmp = this.curMsgData.trim();
        if (tmp.length !== 0)
        {
			this.NewhandleSubmitNewMessage(tmp);
			this.curMsgData = '';
        }
    },
	getRoomName(){
		if(this.user_id < this.uId)
			return this.user_id+"-"+this.uId;
		else
			return this.uId+"-"+this.user_id;
	},
	NewhandleSubmitNewMessage(message:string){
			const messageData = {
				id: 0,
				isInvite: false,
				from_id: this.user_id,
				to_id: this.uId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: message
			};
			this.socket.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
				}
			)
	},

	getRoomQuery(){
		return (this.user_id > this.uId) ? this.user_id.toString() + this.uId.toString() : this.uId.toString() + this.user_id.toString();
	},
	NewhandleSubmitNewInvite(){

			console.log(`called invite`);
			const messageData = {
				id: 0,
				isInvite: true,
				inviteStatus: 0,
				from_id: this.user_id,
				to_id: this.uId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: '',
			};
			this.socket.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
					console.log(response);
					if(response.status)
					{
						// this.newMessage(messageData);
						console.log('onevone');
						router.push({name : 'onevone', query: {room_name_1vs1: this.getRoomQuery(), pos: 'left'}});
					}
				}
			)
	},
	acceptInvite(msgObj:message, msg_index:number){
		// if player who pressed invite has quit call  this.acceptedWhenFriendIsInvalid(msg_index);
		const messageData = {
			isInvite: true,
				inviteStatus: 2,
				accepted:true,
				id: msgObj.id,
				created: msgObj.created,
				to_id: this.uId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: ''
			};
			this.socket.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
					if(response.status)
					{
						//router.push({name : 'onevone', query: {room_name_1vs1: this.user_id.toString() + '_' + this.uId.toString(), pos: 'right'}});
						router.push({name : 'onevone', query: {room_name_1vs1: this.getRoomQuery(), pos: 'right'}});
					}
				}
			)

	},
		declineInvite(msgObj:message, msg_index:number){

			// console.log(`decline at room ${this.user_id.toString() + '_' + this.uId.toString()}`);
			let socket = io(`http://${process.env.VUE_APP_HOST_IP}:3000/onevone`);
			socket.on('connect', () => {
				socket.emit('decline', this.getRoomQuery());
				socket.disconnect();
			});

			const messageData = {
				id: msgObj.id,
				isInvite: true,
				inviteStatus: 2,
				accepted:false,
				created: msgObj.created,
				to_id: this.uId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: ''
			};
			this.socket.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
					if(response.status)
					{
					}
				}
			)

			// i need to remove [[accept], [remove]] from render array
			store.commit('remove_at', msg_index);

		},
		directPlay(msgObj:message)
		{
			const messageData = {
				isInvite: true,
				id: msgObj.id,
				inviteStatus: 3,
				created: msgObj.created,
				to_id: this.uId,
				username: this.username,
				avatar: this.avatar,
				roomName: this.getRoomName(),
				message: ''
			};
			this.socket.emit(
				'private-chat',
				{ 
					data: messageData
				},
				// send message callback
				(response: any) => {
					if(response.status)
					{
						// TODO: redirect to play game room
						// player who send request has recieved message that says let's play
						// console.log("Go to play game");
					}
				}
			)

			// TODO: redirect to play game room
			// console.log("Go to play game");
		},

	acceptingMsg(){
		this.socket.on(this.getRoomName(), ({data}) => {
			if( 
				data.isInvite == false ||
				(data.isInvite == true &&  data.inviteStatus == 0 && data.to_id == this.user_id ) ||
				(data.isInvite == true &&  data.inviteStatus == 1 && data.from_id == this.user_id )
			)
			{
				this.newMessage(data);
			}
		});
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
				isInvite:data.isInvite,
				inviteStatus: data.inviteStatus,
				id: data.id,
				room_id: data.room_id,
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
			let a = new Date(unix_timestamp);
			let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			let year = a.getFullYear();
			let month = months[a.getMonth()];
			let date = a.getDate();
			let hour = a.getHours();
			let min = a.getMinutes();
			let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
			return time;
	  },
	  userIconClicked(msg:message)
	  {
		  	this.isPopUp = true;
			this.clickeduser_id = msg.from_id;
		  	// console.log(`message clicked ${msg.from_id} user id is ${this.user_id}`);
	  },
	  disablePopUp()
	  {
		  // console.log('blured');
		  this.isPopUp = false;
	  },
	  profileClicked()
	  {
		this.isPopUp = false;
		if (this.clickeduser_id !== this.user_id){
			router.push({name: 'FriendProfile', query: {friend_id: this.clickeduser_id}});
			return;
		}
		router.push({name: 'profile'});
	  },
	  inviteClicked()
	  {
		//   let val:boolean = false;
		//   this.NewhandleSubmitNewMessage('', val);  // working here
		// user id is this.user_id
		// clicked user id is this.clickeduser_id
		  // console.log(`private invite clicked bublic room logged id ${this.user_id} friend id ${this.clickeduser_id}`);

		  this.NewhandleSubmitNewInvite();


		  this.isPopUp = false;
	  },


	async addAdmin()
	{
		const resp = await axios.post(
			`http://${process.env.VUE_APP_HOST_IP}:8080/room/${this.roomId}/add-admin`,
			{
				"user_id": this.clickeduser_id
			},
		);

		if(!resp.data.status)
		{
			this.isPopUp = false;
		}

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