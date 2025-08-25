import { Stock} from "../routes/index.mjs";

export const createStock =  async (req, res) => {
    try {
      if (req.body === null) {
       message = "aucun Stock n'a ete envoyées"
        res.status(500).json({ message })
      }
      
      const stock = await Stock.create(req.body); // ← crée l'utilisateur avec les données envoyées
      res.status(201).json(stock);

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }


  }


export const deleteStock =  (req, res) => {
        try {
            Stock.findByPk(req.params.id).then(stock => {
                if (stock === null) {
                    const message = "aucun appel n'a ete inéxistants"
                    return res.status(404).json({ message })
                }

                const id = req.params.id
                const stockDelete = stock
                   return stock.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant n°${stock.name} a bien été supprimé.`
                    res.status(201).json({ message,  stockDelete })
                })
            }
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
   

export const findByPkStock =  (req, res) => {
    Stock.findByPk(req.params.id).then(
      stock => {
        const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
        res.json({ Message, stock })
      })
  }


export const findAllStock =  (req, res) => {
        const infos = req.query.name || req.query.status || req.query.supplier 
        const limit = Number(req.query.limit)
        
        
        const research = (infos,limit) =>{
            try{
            if(infos.length <= 2){
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            Call.findAndCountAll({where:{infos: {[Op.like]: `%${infos}%`}},limit:limit,order:['name']}).then(({count,rows}) =>{
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
            Stock.findAll({order:['name']}).then(
            stock => {
                const Message = "tout les stocks on bien ete recuperer"
                res.status(200).json({ Message, stock})
            })
        }

       
    }


export const updateStock = (req, res) => {
        const id = req.params.id
        try {
            Stock.update(req.body, {
                where: { id: id }
            })
            Stock.findByPk(id).then(stock => {
                const message = `Le stock de ${stock.name} a bien été modifié.`
                res.status(201).json({ message, stock })
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }


    }