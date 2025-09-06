import express from "express";
import OpenAI from "openai";
import "dotenv/config";
import { User, TimeEntry, Call, Candidate, Stock, Note } from "./routes/index.mjs";
import { sequelize } from "./routes/index.mjs";

const models = { User, TimeEntry, Call, Candidate, Stock, Note }


const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENAI_API_KEY, defaultHeaders: {
        'X-Title': 'Pulse Business Manager', // Optional. Site title for rankings on openrouter.ai.
    },
});

// ton dossier où tu définis User, Call, etc.

async function dumpDatabase() {
    const data = {};
    for (const [name, model] of Object.entries(models)) {
        try {
            const rows = await model.findAll({ raw: true });
            data[name] = rows;
        } catch (err) {
            console.error(`Erreur sur ${name}:`, err.message);
        }
    }
    return data;
}

async function getSchema() {
    const [results] = await sequelize.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' -- adapte selon MySQL/MariaDB
    ORDER BY table_name;
  `);

    return results;
}


const apiAi = express.Router()
// 🔍 Endpoint recherche intelligente
apiAi.post("/search", async (req, res) => {
    const { query } = req.body;
    const schema = await getSchema();
    const data = await dumpDatabase();
    try {
        // 1. Demander à l’IA de transformer la question en pseudo-requête
        const aiResponse = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Tu es un assistant spécialisé qui convertit des questions en requêtes Sequelize/MySQL prêtes à être exécutées dans un projet Node.js (ERP pour un call center).

📂 Base de données disponible avec les tables et leurs colonnes :
- User(id, firstName, lastName, role, email, password, avatar, isActive,createdAt,updatedAt)
- Call(id, userId,customerName,customerPhone,campaign,startTime, date, duration,endTime,outcome,notes,tags,recording)
- Stock(id, name, category, quantity,minThreshold,price,status,createdAt,updatedAt,status)
- Note(id, title, content, category, priority, tags, isPinned,createdAt,updatedAt)
- Candidate(id, firstName,lastName,email,phone,position,status,resume,experience,skills,salary,interviewDate,notes,createdAt,updatedAt)
- TimeEntry(id, userId, checkIn, checkOut, date, duration, status, notes)

🎯 Objectif : 
- Générer UNIQUEMENT du code Sequelize en JavaScript, sans préfixe 'javascript', directement exécutable.
- Toujours retourner une valeur exploitable (via 'return' ou 'res.json(...)') pour que la réponse puisse être utilisée par mon backend Node.js.
- Utiliser 'await' correctement à l'intérieur d'une fonction asynchrone.
- Respecter les relations entre les tables (ex: 'User' ↔ 'Call' par 'userId').
- Si plusieurs résultats sont possibles, retourne un tableau JSON exploitable.
- Si la requête concerne une agrégation (ex: COUNT, SUM, AVG), utilise les fonctions Sequelize appropriées.
- si la requête inclus les donnée confidentiels comme le password effectuer là mais ne renvoie pas se champ.
- dans toute tes requête n'affiche que les information essentiel 

Voici le schéma actuel de la base de données :
${JSON.stringify(schema, null, 2)}

Voici quelques tuples existants :
${JSON.stringify(data, null, 2)}


⚡ Format attendu : 
Ton code doit toujours être de la forme :

(async () => {
   const result = await <REQUETE_SEQUELIZE>;
   return result; // ou res.json(result) si on doit envoyer une réponse API
})()

📌 Exemples :
- Question : "Liste tous les utilisateurs"
Réponse :
(async () => {
   const result = await User.findAll();
   return result;
})()

- Question : "Nombre total d’appels"
Réponse :
(async () => {
   const result = await Call.count();
   return result;
})()

- Question : "Durée totale des appels d’un utilisateur avec id=1"
Réponse :
(async () => {
   const result = await Call.sum('duration', { where: { userId: 1 } });
   return result;
})()

❌ Ne jamais ajouter d’explications ou de texte en dehors du code. 
Retourne uniquement le code Sequelize exécutable.
❌ dans toute tes requête n'affiche que les information essentiel.

`,
                },
                { role: "user", content: query },
            ],
        });

        const sequelizeQuery = aiResponse.choices[0].message.content;
        console.log("⚡ Requête générée :", sequelizeQuery);

        // 2. ⚠️ Évaluer la requête générée (en production -> parser & valider pour éviter SQL injection)

        async function runSequelizeQuery(queryCode) {
            try {
                const result = await eval(queryCode); // exécute la requête générée
                return result; // valeur exploitable en JS
            } catch (err) {
                console.error("Erreur lors de l'exécution de la requête :", err);
                throw err;
            }
        }
        function buildLabel(row) {
            const data = row.toJSON ? row.toJSON() : row; // Sequelize instance → JSON

            // Concatène toutes les clés/valeurs en string
            return Object.entries(data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" | ");
        }
        function formatForFrontend(tableName, rows) {
            if(Array.isArray(rows)){
                rows.map(row => {
                return {
                    type: tableName,                        // ex: "User" / "Call" / "Stock"
                    label: buildLabel(row),
                    icon: row.avatar,       // petite fonction pour associer des icônes
                    path: `/${tableName}/${row.id}` // chemin dynamique
                };
            })
            }else{
                return {
                    type: tableName,                        // ex: "User" / "Call" / "Stock"
                    label: buildLabel(rows),
                    icon: rows.avatar,       // petite fonction pour associer des icônes
                    path: `/${tableName}/${rows.id}` // chemin dynamique
                };
            }
        }


        // Exemple :
        const result = await runSequelizeQuery(sequelizeQuery);
        const tableName = result.constructor.name
        console.log(tableName)
        const formatted = formatForFrontend(tableName, result)
        console.log(formatted)
        res.json({ formatted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur recherche intelligente" });
    }
});

export default apiAi