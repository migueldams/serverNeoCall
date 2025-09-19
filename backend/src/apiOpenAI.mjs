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

apiAi.get("/remuneration", async (req, res) => {
  const schema = await getSchema();
  const data = await dumpDatabase();
  try {
    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
                En te basant sur les données de la base de données (tables Agents, Calls, Performances, TimeEntries),
                Voici le schéma actuel de la base de données :
                ${JSON.stringify(schema, null, 2)}
                Voici les tuples existants :
                ${JSON.stringify(data, null, 2)}
                
                calcule la rémunération mensuelle de chaque agent.  
- La rémunération fixe est de [X] FCFA par heure de présence validée.  
- Une prime de performance est attribuée en fonction des indicateurs suivants :  
   • Nombre d’appels traités  
   • Taux de conversion des ventes  
   • Satisfaction client moyenne  
   • Respect des objectifs hebdomadaires  

Formule de calcul :  
Salaire_total = (heures_presence × 2000) 
              + (appels_traites × 50) 
              + (ventes_realisees × 500) 
              + (bonus_satisfaction)

Retourne les résultats sous forme de tableau JSON contenant :  
[
  {
    "agent": "Nom Agent",
    "heures_presence": nombre,
    "appels_traites": nombre,
    "ventes_realisees": nombre,
    "taux_conversion": pourcentage,
    "prime_performance": montant,
    "salaire_total": montant
  }
]

                `
        },{role: "user"},
      ]
    })
    const response = aiResponse.choices[0].message.content;
    const formatted = await eval(response)
    res.json({ formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur recherche intelligente" });
  }

})


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
          content: `Tu es un assistant spécialisé qui répond aux questions des utilisateurs sur la base de données d’un ERP de Call Center.

📌 Contexte :
- Tu as en permanence accès à la totalité de la base de données, sa structure et ses tuples (schéma + données).
Voici le schéma actuel de la base de données :
${JSON.stringify(schema, null, 2)}
Voici les tuples existants :
${JSON.stringify(data, null, 2)}

- Tu n’as PAS besoin de générer du code Sequelize ni du SQL.
- Ta tâche est de fournir directement les résultats attendus, dans un format structuré adapté au frontend.

📌 Format de sortie (obligatoire) :
Retourne toujours un tableau d’objets JSON au format suivant :
[
  {
    "type": "NomDeLaTable",       // Exemple: "User", "Call", "Stock"
    "label": "Texte descriptif",  // Résumé lisible des données (concaténation des colonnes importantes)
    "icon": "code de l'icone",       // Choisis une icône en fonction de la table (ex: "user", "phone", "package", "note", "candidate", "time")
    "path": "/table/id"           // Facultatif : chemin d'accès pour l'élément, ex: "/user/4"
  }
]

📌 Règles de génération :
1. **Type** = toujours le nom de la table où les résultats ont été trouvés.
2. **Label** = concatène dynamiquement toutes les informations pertinentes de la ligne et fait la mise en forme avec les couleur police,style,emoji selon l'importance (ex: pour User → " name(en gras): Alice(police plus grande) , email:alice@mail.com").
3. **Icon** = choisis selon la table et donnée le code react de l'icone :
   - User → "user"
   - Call → "phone"
   - Stock → "package"
   - Note → "note"
   - Candidate → "users"
   - TimeEntry → "clock"
4. **Path** = facultatif, mais si possible construis un chemin du type "/<table>/<id>".
5. Si aucune donnée correspondante n’existe, retourne un tableau vide "[]".

📌 Exemples :
- Question : "Montre-moi tous les utilisateurs"
  Réponse :
  [
    {
      type: "User",
      label: " name:Alice
       email:alice@mail.com",
      icon: "user",
      path: "/user/1"
    },
    {
      type: "User",
      label: "name:Bob
       email:bob@mail.com",
      icon: "user",
      path: "/user/2"
    }
  ]

- Question : "Quels sont les appels de l’utilisateur Alice ?"
  Réponse :
  [
    {
      "type": "Call",
      "label": "nom:Alice(en gars) (à la ligne) date:2025-09-01 , duration:120",
      "icon": "phone",
      "path": "/call/1"
    }
  ]

📌 Rappel :
- Ne génère jamais de code (Sequelize ou SQL).
- Répond uniquement avec les résultats JSON formatés.
- Si la question est ambiguë ou hors sujet, retourne un tableau vide "[]".
- fait la mise en forme du text en Label avec les emoji,style,police et bold
`,
        },
        { role: "user", content: query },
      ],
    });

    const response = aiResponse.choices[0].message.content;
    const formatted = await eval(response)
    res.json({ formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur recherche intelligente" });
  }
});

export default apiAi