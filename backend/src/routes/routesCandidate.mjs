import { createCandidate,deleteCandidate,updateCandidate,findAllCandidate,findByPkCandidate } from "../service/serviceCandidate.mjs";
import { auth } from "../auth/auth.mjs";
// appel de toute les route Candidates
export default (router) => {
    router.post('/api/createCandidate',auth, createCandidate)
    router.delete('/api/deleteCandidate/:id',auth,deleteCandidate)
    router.get('/api/Candidates/:id',auth,findByPkCandidate) 
    router.get('/api/Candidates',auth,findAllCandidate)
    router.put('/api/updateCandidate/:id',auth,updateCandidate)
    
}