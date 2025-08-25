import { Note } from "../routes/index.mjs";



export const createNote =  async (req, res) => {
    try {
      if (req.body === null) {
       message = "aucune Notes n'a ete envoyées"
        res.status(500).json({ message })
      }
      
      const note = await Note.create(req.body); // ← crée l'utilisateur avec les données envoyées
      res.status(201).json(note);

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }


  }


export const deleteNote =  (req, res) => {
        try {
            Note.findByPk(req.params.id).then(note => {
                if (note === null) {
                    const message = "aucun appel n'a ete inéxistants"
                    return res.status(404).json({ message })
                }

                const id = req.params.id
                const noteDelete = note
                   return note.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant n°${note.title} a bien été supprimé.`
                    res.status(201).json({ message,  noteDelete })
                })
            }
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
   

export const findByPkNote =  (req, res) => {
    Note.findByPk(req.params.id).then(
      note => {
        const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
        res.json({ Message, note })
      })
  }


export const findAllNotes =  (req, res) => {
        const infos = req.query.title || req.query.content 
        const limit = Number(req.query.limit)
        
        
        const research = (infos,limit) =>{
            try{
            if(infos.length <= 2){
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            Note.findAndCountAll({where:{infos: {[Op.like]: `%${infos}%`}},limit:limit,order:['title']}).then(({count,rows}) =>{
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
            Note.findAll({order:['title']}).then(
            notes => {
                const Message = "tout les notes on bien ete recuperer"
                res.status(200).json({ Message, notes})
            })
        }

       
    }


export const updateNote = (req, res) => {
        const id = req.params.id
        try {
            Note.update(req.body, {
                where: { id: id }
            })
            Note.findByPk(id).then(note => {
                const message = `Le stock de ${note.title} a bien été modifié.`
                res.status(201).json({ message, note })
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }


    }