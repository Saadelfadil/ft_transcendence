import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import globalFunctions from './components/global/loginCheck'


createApp(App).mixin(globalFunctions).use(store).use(router).mount('#app')
