import router from "./index.mjs";
import { createUser } from "../service/ServiceUser.mjs";
import { deleteUser } from "../service/ServiceUser.mjs";
import { updateUser } from "../service/ServiceUser.mjs";
import { findAllUser } from "../service/ServiceUser.mjs";
import { findByPkUser } from "../service/ServiceUser.mjs";
import { auth } from "../auth/auth.mjs";


// appel de toute les route users
export default (router) => {
    router.post('/api/createUser',auth, createUser)
    router.delete('/api/deleteUser/:id',auth,deleteUser)
    router.get('/api/users/:id',auth,findByPkUser) 
    router.get('/api/users',auth,findAllUser)
    router.put('/api/updateUser/:id',auth,updateUser)
    
}




