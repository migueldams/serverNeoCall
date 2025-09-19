import { createTeam, updateTeam, presenceTeam, listTeam, findAllTeam} from "../service/serviceTeam.mjs";
import { auth } from "../auth/auth.mjs";


export default (router) =>{
    router.post('/api/createTeam',auth,createTeam)
    router.put('/api/updateTeam',auth,updateTeam)
    router.get('/api/presenceTeam',auth,presenceTeam)
    router.get('/api/listTeam', auth,listTeam)
    router.get('/api/findAllTeam',auth,findAllTeam)
}