
import { Sequelize } from "sequelize";
import { mockcUser } from "../mockdata/mockUser.mjs";
import { mockStocks } from "../mockdata/mockStock.mjs";
import { mockNotes } from "../mockdata/mockNotes.mjs";
import { mockCandidates } from "../mockdata/mockCandidate.mjs";
import { User } from '../routes/index.mjs'
import { Stock, Note, Candidate } from "../routes/index.mjs";
import bcrypt, { hash } from 'bcrypt'

//⚙ synchronisation de la db
export default () => {


  const sequelize = new Sequelize(
    'call_centers',
    'root',
    '',
    {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        timezone: 'Z'
      },
      logging: false
    }

  )


  sequelize.authenticate().then(
    console.log("✔ base de donnee connecter"))



  sequelize.sync({ force: true }).then(async () => {


    const users = await Promise.all(
      mockcUser.map(data =>
        bcrypt.hash(data.password, 10).then(hash =>
          User.create({
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            avatar: data.avatar,
            isActive: data.isActive,
            lastLogin: data.lastLogin,
            password: hash,
            department: data.department,
            phoneNumber: data.phoneNumber
          })
        )))

    mockStocks.map(data => {
      Stock.create({
        id: data.id,
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        minThreshold: data.minThreshold,
        price: data.price,
        supplier: data.supplier,
        status: data.status
      })
    })
    mockNotes.map(data => {
      Note.create({
        id: data.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        category: data.category,
        priority: data.priority,
        tags: data.tags,
        isPinned: data.isPinned,
      })
    })
    mockCandidates.map(data => {
      Candidate.create({
        firstName:data.firstName,
        lastName: data.lastName,
        email:data.email,
        phone: data.phone,
        position: data.position,
        status:data.status,
        resume: data.resume,
        experience: data.experience,
        skills: data.skills,
        salary: data.salary,
        interviewDate: data.interviewDate,
        notes: data.notes
      })
    })



    console.log('base de donnée synchronisée')
  })

  return sequelize
}

