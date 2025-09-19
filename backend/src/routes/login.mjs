import { Sequelize } from "sequelize";
import { User } from '../routes/index.mjs'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { private_key } from "../auth/private_key.mjs";


export default (router) => {
    router.post('/api/login', (req, res) => {
        try {
            const email = req.body.email
            User.findOne({ where: { email: email } }).then(user => {
                if (!user) {
                    const message = 'identifient inexitant'
                    return res.status(201).json()
                } else {
                    bcrypt.compare(req.body.password, user.password).then(passWordValid => {
                        if (passWordValid) {
                            // jwt 
                            const token = jwt.sign(
                                { userId: user.id },
                                private_key,
                                { expiresIn: '24h' }
                            )
                            const message = 'Connexion réussie !'
                            return res.status(200).json({ message, user, token })

                        } else {
                            const message = 'mots de passe incorret'
                            return res.status(203).json()
                        }

                    }
                    )
                }

            })
        } catch (error) {
            const message = 'connexion impossible , veillée ressayer plus tard'
            res.status(500).json({ message, error: error.message })
        }
    }
    )
}