import { createCall } from "../service/serviceCall.mjs";
import { deleteCall } from "../service/serviceCall.mjs";
import { updateCall } from "../service/serviceCall.mjs";
import { findAllCall } from "../service/serviceCall.mjs";
import { findByPkCall } from "../service/serviceCall.mjs";
import { auth } from "../auth/auth.mjs";

export default (router) => {

    router.post('/api/createCall',auth, createCall)
    router.delete('/api/deleteCall/:id',auth, deleteCall)
    router.get('/api/Call/:id',auth, findByPkCall)
    router.get('/api/Call',auth, findAllCall)
    router.put('/api/updateCall/:id',auth,updateCall)

}