import express from "express";
import OpenAI from "openai";
import "dotenv/config";


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const apiAi = express.Router()
// 🔍 Endpoint recherche intelligente
apiAi.post("/search", async (req, res) => {
    const { query } = req.body;
    try {
        // 1. Demander à l’IA de transformer la question en pseudo-requête
        const aiResponse = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Tu es un assistant qui traduit des questions en requêtes Sequelize/MySQL pour l'ERP d'un call center.
          Les tables disponibles sont: User(id, name, email), Call(id, userId, date, duration), 
          Stock(id, product, quantity), Note(id, userId, content), Candidate(id, name, status), TimeEntry(id, userId, start, end).
          Retourne UNIQUEMENT une requête Sequelize en JavaScript.`,
                },
                { role: "user", content: query },
            ],
        });

        const sequelizeQuery = aiResponse.choices[0].message.content;
        console.log("⚡ Requête générée :", sequelizeQuery);

        // 2. ⚠️ Évaluer la requête générée (en production -> parser & valider pour éviter SQL injection)
        const result = await eval(sequelizeQuery);

        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur recherche intelligente" });
    }
});

export default apiAi