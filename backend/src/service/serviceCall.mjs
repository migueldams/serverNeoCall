import { Call} from "../routes/index.mjs";

export const createCall =  async (req, res) => {
    try {
      if (req.body === null) {
       message = "aucun user n'a ete envoyées"
        res.status(500).json({ message })
      }
      
      const call = await Call.create(req.body); // ← crée l'utilisateur avec les données envoyées
      res.status(201).json(call);

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }


  }


export const deleteCall =  (req, res) => {
        try {
            Call.findByPk(req.params.id).then(call => {
                if (call === null) {
                    const message = "aucun appel n'a ete inéxistants"
                    return res.status(404).json({ message })
                }

                const id = req.params.id
                const callDelete = call
                   return call.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant n°${call.customerName} a bien été supprimé.`
                    res.status(201).json({ message, data: callDelete })
                })
            }
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
   

export const findByPkCall =  (req, res) => {
    Call.findByPk(req.params.id).then(
      call => {
        const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
        res.json({ Message, data: call })
      })
  }


export const findAllCall =  (req, res) => {
        const infos = req.query.customerName || req.query.customerPhone
        const limit = Number(req.query.limit)
        
        
        const research = (infos,limit) =>{
            try{
            if(infos.length <= 2){
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            Call.findAndCountAll({where:{infos: {[Op.like]: `%${infos}%`}},limit:limit,order:['infos']}).then(({count,rows}) =>{
                const message = " il y a " + count + " dont le nom contient" + infos
                res.status(200).json({message,data: rows})
            })
            }catch(error){
                res.status(404).json({error:error})
            }
        }


        if(infos ){
            research(infos,1)
        } else{
            Call.findAll({order:['customerName']}).then(
            call => {
                const Message = "tout les appels on bien ete recuperer"
                res.json({ Message, data: call})
            })
        }

       
    }


export const updateCall = (req, res) => {
        const id = req.params.id
        try {
            Call.update(req.body, {
                where: { id: id }
            })
            Call.findByPk(id).then(call => {
                const message = `Le pokémon ${call.customerName} a bien été modifié.`
                res.status(201).json({ message, data: call })
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }


    }