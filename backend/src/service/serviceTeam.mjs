import { Team, User, TimeEntry, sequelize } from "../routes/index.mjs";
import { QueryTypes } from "sequelize";

export const createTeam = async (req, res) => {
    try {
        if (req.body === null) {
            message = "aucun donnée n'a ete envoyées"
            res.status(500).json({ message })
        }

        const team = await Team.create(req.body); // ← crée équipe avec les données envoyées
        res.status(201).json(team);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }


}


export const updateTeam = (req, res) => {
    const id = req.params.id
    try {
        Team.update(req.body, {
            where: { id: id }
        })
        Team.findByPk(id).then(user => {
            const message = `Le pokémon ${user.firstName} a bien été modifié.`
            res.status(201).json({ message, user })
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }


}
export const findAllTeam = (req, res) =>{
    try{
        Team.findAll({order:['name']}).then(
            Team => {
                const Message = "tout les Team on bien ete recuperer"
                res.status(200).json({ Message,Team})
            })  
    }catch(error){
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}


const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const presenceTeam = async (req, res) => {
    try {
  
  const teamPresence = await sequelize.query(`
    SELECT 
        t.id            AS team_id,
        t.name          AS team_name,
        t.campaing      AS team_campaing,
        t.avatar        AS team_avatar,

        u.id            AS user_id,
        u.firstName     AS user_firstName,
        u.lastName      AS user_lastName,
        u.role          AS user_role,
        u.status_activite AS user_status,

        te.checkIn      AS timeEntry_checkIn,
        te.duration     AS timeEntry_workTime

    FROM teams t
    LEFT JOIN users u
        ON u.team = t.id
    LEFT JOIN time_entries te
        ON te.userId = u.id
       AND te.checkIn >= '${today} 00:00:00'
       AND te.checkIn <= '${today} 23:59:59'

    ORDER BY 
        t.name ASC,
        u.lastName ASC;
  `,
    { type: QueryTypes.SELECT });
    res.status(200).json({ teamPresence });
} catch (error) {
  console.error("Erreur get presence:", error);
  res.status(500).json({ error: "Erreur récupération présence" });
}
}



export const listTeam = async (req, res) => {
    try {
  
  const teamList = await sequelize.query(`
    SELECT 
    t.id AS team_id,
    t.name AS team_name,
    t.status_activite AS Status,
    u.id AS user_id,
    u.firstName,
    u.lastName,
    u.email,
    u.status_activite,
    u.isActive
FROM teams t
LEFT JOIN users u ON u.team = t.id
ORDER BY t.id, u.id;
  `,
    { type: QueryTypes.SELECT });
    res.status(200).json({ teamList });
} catch (error) {
  console.error("Erreur get presence:", error);
  res.status(500).json({ error: "Erreur récupération présence" });
}
}
