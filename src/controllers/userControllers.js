const pool = require('../database/connection')
const { hash } = require('bcrypt')
const { sign } = require('jsonwebtoken')

const { validationUserRegisterOrLoginOrEdit, httpStatusCodes } = require('../utils')

const { OK, CREATED, NO_CONTENT, INTERNAL_SERVER_ERROR } = httpStatusCodes

const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body

    const { statusCode, mensagem } = await validationUserRegisterOrLoginOrEdit(req.body, 'register')

    if(statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    try {
        const encryptedPassword = await hash(senha, 10)

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email;'
        const { rows } = await pool.query(query, [nome, email, encryptedPassword])

        return res.status(CREATED).json(rows[0])
    } catch ({ message }) {
        res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const userLogin = async (req, res) => {
    const { statusCode, mensagem, ...registeredUser } = await validationUserRegisterOrLoginOrEdit(req.body, 'login')
    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    const { senha: _, ...usuario } = registeredUser
    const token = sign({ id: usuario.id }, process.env.jwt_password, { expiresIn: '8h' })

    return res.status(OK).json({ usuario, token })
}

const getUserDetails = (req, res) => {
    return res.status(OK).json(req.user)
}

const editUser = async (req, res) => {
    const { nome, email, senha } = req.body

    const registeredUser = await validationUserRegisterOrLoginOrEdit(req.body, 'edit')
    const { statusCode, mensagem } = registeredUser

    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    try {
        const encryptedPassword = await hash(senha, 10)

        const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4;'
        await pool.query(query, [ nome, email, encryptedPassword, req.user.id ])

        return res.status(NO_CONTENT).json()
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

module.exports = {
    registerUser,
    userLogin,
    getUserDetails,
    editUser
}

