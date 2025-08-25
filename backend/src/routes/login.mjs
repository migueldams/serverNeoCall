import { Sequelize } from "sequelize";
import { User } from '../routes/index.mjs'
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import { private_key } from "../auth/private_key.mjs";


export default (router) => {
    router.post('/api/login', (req, res) => {
        try {
            const email = req.body.email
            User.findOne({ where: { email: email } }).then(user => {
                if (!user) {
                    const message = 'identifient inexitant'
                    return res.status(404).json({ message })
                }
                bcrypt.compare(req.body.password, user.password).then(passWordValid => {
                    if (passWordValid) {
                        // jwt 
                        const token = jwt.sign(
                            { userId: user.id },
                            private_key,
                            { expiresIn: '24h' }
                        )
                        const message = 'user bien connecter'
                        return res.status(200).json({ message, user ,token})
                        
                    } else {
                        const message = 'mots de passe incorret'
                        return res.status(401).json({ message })
                    }

                }
                )
            })
        } catch (error) {
            Message = 'connexion impossible , veillée ressayer plus tard'
            res.status(500).json({ Message, error: error.message })
        }
    }
    )
}