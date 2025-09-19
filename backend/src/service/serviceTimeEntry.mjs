
import  {User,TimeEntry ,sequelize} from '../routes/index.mjs'
import { QueryTypes } from 'sequelize'

export const createTimeEntry = async (req, res) => {
    try {
        if (req.body === null) {
            message = "aucune TimeEntrys n'a ete envoyées"
            res.status(500).json({ message })
        }

        const timeEntry = await TimeEntry.create(req.body)
        console.log(timeEntry,'valeur du eniti') // ← crée l'utilisateur avec les données envoyées
        res.status(201).json(timeEntry);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }


}


export const deleteTimeEntry
    = (req, res) => {
        try {
            TimeEntry.findByPk(req.params.id).then(timeEntry => {
                if (timeEntry === null) {
                    const message = "aucun appel n'a ete inéxistants"
                    return res.status(404).json({ message })
                }

                const id = req.params.id
                const TimeEntryDelete = timeEntry

                return timeEntry.destroy({ where: { id: id } }).then(_ => {
                    const message = `Le user avec l'identifiant  a bien été supprimé.`
                    res.status(201).json({ message, TimeEntryDelete })
                })
            }
            )
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }


export const findByPkTimeEntry = (req, res) => {
    TimeEntry.findByPk(req.params.id).then(
        TimeEntry => {
            const Message = "le user donc id est" + req.params.id + " a bien ete trouver"
            res.status(200).json({ TimeEntry })
        })
}


export const findAllTimeEntrys = (req, res) => {
    const infos = req.query.title || req.query.content
    const limit = Number(req.query.limit)


    const research = (infos, limit) => {
        try {
            if (infos.length <= 2) {
                return res.status(500).json('veillée entrer aumoins deux caractere')
            }
            TimeEntry
                .findAndCountAll({ where: { infos: { [Op.like]: `%${infos}%` } }, limit: limit, order: ['date'] }).then(({ count, rows }) => {
                    const message = " il y a " + count + " dont le nom contient" + infos
                    res.status(200).json({ message, rows })
                })
        } catch (error) {
            res.status(404).json({ error: error })
        }
    }


    if (infos) {
        research(infos, 1)
    } else {
        TimeEntry.findAll({ order: ['date'] }).then(
            timeEntrys => {
                const Message = "tout les TimeEntrys on bien ete recuperer"
                res.status(200).json({ Message, timeEntrys })
            })
    }


}


export const updateTimeEntry = (req, res) => {
    const id = req.params.id
    try {
        console.log(req.body, id)
        TimeEntry.update(req.body, {
            where: { id: id }
        })
        TimeEntry.findByPk(id).then(TimeEntry => {
            const message = `Le stock de  a bien été modifié.`
            res.status(201).json({ message, TimeEntry })
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }


}


export const findAllTimeEntry = (req, res) => {
    const user_id = req.params.id;

    try {
        const user = User.findOne({
            where: { userId: user_id },
            include: [{ model: TimeEntry }]
        });

        if (!user) {
            return res.status(404).json({ message: `Utilisateur ${user_id} introuvable` });
        }
        const message = `Toutes les TimeEntrys du user ${user_id} ont bien été récupérées`;
        // récupération de l'entrée du jour sans checkout
        const today = new Date().toISOString().split("T")[0];

        const entry = user.TimeEntry?.find(
            e => e.date === today && !e.checkOut
        );

        console.log(message)
        res.status(200).json({ message, entry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

export const findTimeAllUser = async (req,res) =>{
    const user_id = req.params.id;
    try{
         const timeUser = await sequelize.query(`
    SELECT 
  u.*,
  t.*
FROM users u
LEFT JOIN time_entries t 
  ON u.id = t.userId
WHERE u.id = ${user_id}
LIMIT 1;

  `,
    { type: QueryTypes.SELECT });
        res.status(200).json(timeUser)

    }catch(error){
        console.log(error)
         res.status(500).json({ error: error.message });
    }
}
