import {Candidate} from "../routes/index.mjs";
export const createCandidate =  async (req, res) => {
    try {
      if (req.body === null) {
       message = "aucun Candidate n'a ete envoyées"
        res.status(500).json({ message })
      }
      
      const candidate = await Candidate.create(req.body); // ← crée l'utilisateur avec les données envoyées
      res.status(201).json(candidate);

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }


  }


export const deleteCandidate =  (req, res) => {
        try {
            Candidate.findByPk(req.params.id).then(candidate => {
                if (candidate === null) {
                    const message = "aucun appel n'a ete inéxistants"
                    return res.status(404).json({ message })
                }

                const id = req.params.id
                const candidateDelete = candidate
                   return candidate.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant n°${candidate.firstName} a bien été supprimé.`
                    res.status(201).json({ message, candidateDelete })
                })
            }
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
   

export const findByPkCandidate =  (req, res) => {
    Candidate.findByPk(req.params.id).then(
      candidate => {
        const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
        res.json({ Message, candidate })
      })
  }


export const findAllCandidate =  (req, res) => {
        const infos = req.query.firstName || req.query.status || req.query.email 
        const limit = Number(req.query.limit)
        
        
        const research = (infos,limit) =>{
            try{
            if(infos.length <= 2){
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            Call.findAndCountAll({where:{infos: {[Op.like]: `%${infos}%`}},limit:limit,order:['firstName']}).then(({count,rows}) =>{
                const message = " il y a " + count + " dont le nom contient" + infos
                res.status(200).json({message, rows})
            })
            }catch(error){
                res.status(404).json({error:error})
            }
        }


        if(infos ){
            research(infos,1)
        } else{
            Candidate.findAll({order:['firstName']}).then(
            candidate => {
                const Message = "tout les Candidates on bien ete recuperer"
                res.status(200).json({ Message, candidate})
            })
        }

       
    }


export const updateCandidate = (req, res) => {
        const id = req.params.id
        try {
            Candidate.update(req.body, {
                where: { id: id }
            })
            Candidate.findByPk(id).then(candidate => {
                const message = `Le Candidate de ${candidate.firstName} a bien été modifié.`
                res.status(201).json({ message, candidate })
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }


    }