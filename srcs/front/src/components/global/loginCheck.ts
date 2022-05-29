import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { numberLiteralTypeAnnotation } from '@babel/types';


export default {
    data()
    {
        return {
            auth_switch: false as boolean,
            logged: false as boolean,
            user_id: 0 as number,
            avatar: '' as string,
            username: '' as string,
        }
    },
    methods: {
        async checkLogin()
        {
            ////console.log("component name: ", (this as any).$options.name);
            if ((this as any).$options.name === "RouterLink" ||
            (this as any).$options.name === "RouterView"  || (this as any).$options.name === "ManagerBlock" || (this as any).$options.name === "LoginBlock") return 

                const resp = await axios({
                    method: 'get',
                    url: `http://${process.env.VUE_APP_HOST_IP}:8080/api/islogin`,
                    withCredentials: true
                });
                if (resp.data.status){
                    (this as any).logged = true;
                    (this as any).auth_switch = resp.data.is_login_db;
                    (this as any).user_id = resp.data.id;

                    ////console.log(`start working id now is ${(this as any).user_id}`);
                    store.commit('set_global_user_id', (this as any).user_id);

                    (this as any).avatar = resp.data.image_url;
                    (this as any).username = resp.data.login;
                    (this as any).joinedRooms = resp.data.joinedRooms;
                    if (resp.data.twof && (this as any).auth_switch)
                    {
                        router.replace({name: 'profile'});
                    }
                } else {
                    (this as any).logged = false;
                    router.replace({name: 'login'});
                    return ;
                }
        }
    },
    async created(){
        await (this as any).checkLogin();
    }
}