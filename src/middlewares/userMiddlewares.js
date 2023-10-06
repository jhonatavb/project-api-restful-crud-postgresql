const pool = require('../database/connection')
const { verify } = require('jsonwebtoken')

const { httpStatusCodes: { BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } } = require('../utils')

const verifyUserLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) return res.status(UNAUTHORIZED).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })

    const token = authorization.split(' ')[1]

    try {
        const { id } = verify(token, process.env.jwt_password)

        const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [ id ])

        if (!rows.length) return res.status(BAD_REQUEST).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })

        delete rows[0].senha

        req.user = rows[0]

        next()
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

module.exports = {
    verifyUserLogin
}


