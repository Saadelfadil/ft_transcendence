
import axios from 'axios';
import router from '@/router';
import { numberLiteralTypeAnnotation } from '@babel/types';



export default {
    data()
    {
        return {
            auth_switch: false as boolean,
            logged: false as boolean,
            user_id: 0 as number,
        }
    },
    methods: {
        async checkLogin()
        {
            if ((this as any).$options.name === "RouterLink" || 
            (this as any).$options.name === "RouterView"  || (this as any).$options.name === "ManagerBlock" || (this as any).$options.name === undefined) return 
            try{
                const resp = await axios({
                    method: 'get',
                    url: 'http://localhost:8080/api/islogin',
                    withCredentials: true
                });
                (this as any).logged = true;
                (this as any).auth_switch = resp.data.is_login_db;
                (this as any).user_id = resp.data.id;
            }
            catch(e)
            {
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
