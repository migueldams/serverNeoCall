import { createTimeEntry,deleteTimeEntry,updateTimeEntry,findAllTimeEntrys,findByPkTimeEntry,findAllTimeEntry } from "../service/serviceTimeEntry.mjs";
import { auth } from "../auth/auth.mjs";

export default (router)=>{

    router.post('/api/createTimeEntry',auth,createTimeEntry)
    router.delete('/api/deleteTimeEntry/:id',auth,deleteTimeEntry)
    router.put('/api/updateTimeEntry/:id',auth,updateTimeEntry)
    router.get('/api/TimeEntrys',auth,findAllTimeEntrys)
    router.get('/api/TimeEntrys/:id',auth,findByPkTimeEntry)
    router.get('/api/TimeEntry/:id',auth,findAllTimeEntry)
}
