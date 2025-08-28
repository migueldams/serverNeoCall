import express from "express"
import morgan from "morgan"
import initdb from "../config/initdb.mjs";
import modelsUser from "../models/modelsUser.mjs";
import modelsCall from '../models/modelCall.mjs'
import modelsStock from '../models/modelsStock.mjs'
import modelsNotes from "../models/modelsNotes.mjs";
import modelsCandidate from "../models/modelsCandidate.mjs";
import { DataTypes } from "sequelize";
import routesUser from "./routesUser.mjs";
import routesCall from "./routesCall.mjs";
import routesStock from "./routesStock.mjs";
import login from "./login.mjs";
import routesNote from "./routesNote.mjs";
import routesCandidate from "./routesCandidate.mjs";
import modelTimeEntry from "../models/modelTimeEntry.mjs";
import routeTimeEntry from "./routeTimeEntry.mjs";
import routesAssistantAI from "./routesAssistantAI.mjs";

    // declaration de le methode route du server
    const router = express.Router()

    router.use(morgan('dev'))

    // import de la base avec sequelise
    export const sequelize = initdb()


    //appel du models users par sequelise
    export const User = modelsUser(sequelize,DataTypes)
    export const Call = modelsCall(sequelize,DataTypes)
    export const Stock = modelsStock(sequelize,DataTypes) 
    export const Note = modelsNotes(sequelize,DataTypes)
    export const Candidate = modelsCandidate(sequelize,DataTypes)
    export const TimeEntry = modelTimeEntry(sequelize,DataTypes)


    login(router)
    // appel des routes de users
    routesUser(router)
    // appel des routes de Call
    routesCall(router)
    routesStock(router)
    routesNote(router)
    routesCandidate(router)
    routeTimeEntry(router)
    routesAssistantAI(router)

export default router
