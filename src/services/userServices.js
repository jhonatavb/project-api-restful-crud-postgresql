const pool = require('../database/connection')
const { hash } = require('bcrypt')
const { sign } = require('jsonwebtoken')

const createUser = async ({ nome, email, senha }) => {
    try {
        const encryptedPassword = await hash(senha, 10)

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email;'
        const { rows } = await pool.query(query, [ nome, email, encryptedPassword ])

        return rows[0]
    } catch ({ message }) {
        throw new Error(message)
    }
}

const userAuth = ({ senha, ...usuario }) => {
    const token = sign({ id: usuario.id }, process.env.jwt_password, { expiresIn: '8h' })

    return { usuario, token }
}

const editInfoUser = async ({ nome, email, senha }, id) => {
    const encryptedPassword = await hash(senha, 10)

    try {
        const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4;'
        await pool.query(query, [ nome, email, encryptedPassword, id ])
    } catch ({ message }) {
        throw new Error(message)
    }

}

module.exports = {
    createUser,
    userAuth,
    editInfoUser
}

