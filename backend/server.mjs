import express, { Router,urlencoded } from "express";
import router from './src/routes/index.mjs'
import morgan from "morgan";
import cors from 'cors'
import apiAi from "./src/apiOpenAI.mjs";




// port utiliser par le serveur nodejs
const PORT = process.env.PORT || 4000;

//initialisation du serveur express
const app = express()

app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(cors({
  origin: "http://localhost:3000",  // 👈 le port de ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))


//envoie vers les routes
app.use('/post',router)
app.use('/',apiAi)

app.get('/',(req,res)=>{
    const Message = 'le serveur est bien lancer'
    res.json({Message})
})


app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

export default app