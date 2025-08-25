import jwt from 'jsonwebtoken'
import { private_key } from './private_key.mjs'

export const auth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
        return res.status(401).json({ message })
    }

    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, private_key, (error, decodedToken) => {
        try {

            if (error) {
                const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
                console.log(error)
                return res.status(401).json({ message, data: error })

            }
            console.log(decodedToken.userId)

            const userid = decodedToken.userId
            next()
        } catch {
            const message = `L'identifiant de l'utilisateur est invalide.`
            res.status(401).json({ message })
        }

    })
}