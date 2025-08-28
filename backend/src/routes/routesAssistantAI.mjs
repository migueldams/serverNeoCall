import { research } from "../service/serviceAssistantAi.mjs"

export default (router) =>{

    router.post('/research', research )

}