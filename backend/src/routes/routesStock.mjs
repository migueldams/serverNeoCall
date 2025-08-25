import router from "./index.mjs";
import { createStock } from "../service/serviceStock.mjs";
import { deleteStock } from "../service/serviceStock.mjs";
import { updateStock } from "../service/serviceStock.mjs";
import { findAllStock } from "../service/serviceStock.mjs";
import { findByPkStock } from "../service/serviceStock.mjs";
import { auth } from "../auth/auth.mjs";

// appel de toute les route Stocks
export default (router) => {
    router.post('/api/createStock',auth, createStock)
    router.delete('/api/deleteStock/:id',auth,deleteStock)
    router.get('/api/Stock/:id',auth,findByPkStock) 
    router.get('/api/Stock',auth,findAllStock)
    router.put('/api/updateStock/:id',auth,updateStock)
    
}
