
import { User } from '../routes/index.mjs'


// api de création de users 
export const createUser = async (req, res) => {
    try {
      if (req.body === null) {
        message = "aucun user n'a ete envoyées"
        res.status(500).json({ message })
      }
      
      const user = await User.create(req.body); // ← crée l'utilisateur avec les données envoyées
      res.status(201).json(user);

    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }


  }

// api de suppression de users
export const deleteUser = (req, res) => {
        try {
            User.findByPk(req.params.id).then(user => {
                if (user === null) {
                    const message = "aucun user n'a ete inéxistants"
                    return res.status(500).json({ message })
                }

                const id = req.params.id
                const userDelete = user
                   return user.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant n°${user.username} a bien été supprimé.`
                    res.status(201).json({ message, data: user })
                })
            }
            )
        } catch (error) {
            res.status(400).json({ error: error.message })
        }

    }
//  api de recherche par id
export const findByPkUser = (req, res) => {
    User.findByPk(req.params.id).then(
      user => {
        const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
        res.json({ Message, user })
      })
  }

// api de recherche complete
export const findAllUser =  (req, res) => {
        const username = req.query.email || req.query.firstName || req.query.lastName || req.query.phoneNumber|| req.query.role
        const limit = Number(req.query.limit)
        
        
        const research = (username,limit) =>{
            try{
            if(username.length <= 2){
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            User.findAndCountAll({where:{firstName: {[Op.like]: `%${username}%`}},limit:limit,order:['username']}).then(({count,rows}) =>{
                const message = " il y a " + count + " dont le nom contient" + username
                res.json({message,data: rows})
            })
            }catch(error){
                res.json({error:error})
            }
        }


        if(username ){
            research(username,1)
        } else{
            User.findAll({order:['firstName']}).then(
            User => {
                const Message = "tout les users on bien ete recuperer"
                res.status(200).json({ Message, User})
            })
        }

       
}

// api de modification de users
export const updateUser =  (req, res) => {
        const id = req.params.id
        try {
            User.update(req.body, {
                where: { id: id }
            })
            User.findByPk(id).then(user => {
                const message = `Le pokémon ${user.firstName} a bien été modifié.`
                res.status(201).json({ message, user })
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }


}