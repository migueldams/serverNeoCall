import { createNote,deleteNote,updateNote,findAllNotes,findByPkNote,findAllNote } from "../service/serviceNotes.mjs";
import { auth } from "../auth/auth.mjs";

export default (router)=>{

    router.post('/api/createNote',auth,createNote)
    router.delete('/api/deleteNote/:id',auth,deleteNote)
    router.put('/api/updateNote/:id',auth,updateNote)
    router.get('/api/notes',auth,findAllNotes)
    router.get('/api/notes/:id',auth,findByPkNote)
    router.get('/api/note/:id',auth,findAllNote)
}
