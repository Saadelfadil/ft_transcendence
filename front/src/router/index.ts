import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import ProfileBlock from '@/components/Profile.vue'
import LeaderBoardBlock from '@/components/LeaderBoard.vue'
import MatchHistoryBlock from '@/components/MatchHistory.vue'
import GameBlock from '@/components/GAME/Game.vue'
import ChatBlock from '@/components/CHAT/Chat.vue'
import PublicChatBlock from '@/components/CHAT/PublicChat.vue'
import PrivateChatBlock from '@/components/CHAT/PrivateChat.vue'
import CreateRoomBlock from '@/components/CHAT/CreateRoom.vue'
import ErrorPageBlock from '@/components/ErrorPage.vue';
import ChatPublicMsgBlock from '@/components/CHAT/ChatPublicRoomMsg.vue'
import LoginBlock from '@/components/login.vue';
import TEMP from '@/components/PlayerFromGlob.vue';
import WarmUpBlock from '@/components/GAME/WarmUp.vue';
import LevelUpBlock from '@/components/GAME/LevelUp.vue';
import MatchUpBlock from '@/components/GAME/MatchUp.vue';
import StreamBlock from '@/components/GAME/Stream.vue'
import Add from '@/components/Friends/Add.vue'
import Ignore from '@/components/Friends/Ignore.vue'
import Requests from '@/components/Friends/Requests.vue'
import FriendProfile from '@/components/Friends/FriendProfile.vue'
import UsersNavBarBlock from '@/components/UsersNavBar.vue'
import UserFriendsBlock from '@/components/Friends/UserFriends.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {name: 'profile'}
  },
  {
    path: '/login',
    name: 'login',
    component: LoginBlock
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileBlock
  },

  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderBoardBlock
  },
  {
    path: '/matchhistory',
    name: 'matchhistory',
    component: MatchHistoryBlock
  },
  {
    path: '/game',
    name: 'game',
    redirect: {path: '/game/stream'},
    component: GameBlock,
    children: [
      {
        path: 'warmup',
        name: 'warmup',
        component: WarmUpBlock
      },
      {
        path: 'levelup',
        name: 'levelup',
        component: LevelUpBlock
      },
      {
        path: 'matchup',
        name: 'matchup',
        component: MatchUpBlock
      },
      {
        path: 'stream',
        name: 'stream',
        component: StreamBlock
      },
    ]
  },

  {
  path: '/users',
  name: 'users',
  redirect: {path: '/users/requests'},
  component: UsersNavBarBlock,
  children: [
    {
      path: 'yourfriends',
      name: 'YourFriends',
      component: UserFriendsBlock,
    },
  {
    path: 'add',
    name: 'Add',
    component: Add
  },
  {
    path: 'requests',
    name: 'Requests',
    component: Requests
  },
    {
      path: 'ignore',
      name: 'Ignore',
      component: Ignore
    },
    {
      path: 'friendprofile',
      name: 'FriendProfile',
      component: FriendProfile,
    }
  ]
},
  {
    path: '/chat',
    name: 'chat',
    redirect: {path: '/chat/public'},
    component: ChatBlock,
    children: [
      {
        path: 'private',
        name: 'chatprivate',
        component: PrivateChatBlock,
      },
      {
        path: 'public',
        name: 'chatpublic',
        component: PublicChatBlock
      },
      {
        path: 'createroom',
        name: 'chatcreateroom',
        component: CreateRoomBlock,
      },
      {
        path: 'chatpublicmsg',
        name: 'chatpublicmsg',
        component: ChatPublicMsgBlock
      },
    ]
  },

  {
    // this object make sure it's the last one 
    path:'/:notFound(.*)',
    component: ErrorPageBlock
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
