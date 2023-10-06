const { createUser, userAuth, editInfoUser } = require('../services')
const { validationUserRegisterOrLoginOrEdit, httpStatusCodes } = require('../utils')

const { OK, CREATED, NO_CONTENT, INTERNAL_SERVER_ERROR } = httpStatusCodes

const registerUser = async (req, res) => {
    const { statusCode, mensagem } = await validationUserRegisterOrLoginOrEdit(req.body, 'register')

    if(statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    try {
        const user = await createUser(req.body)

        return res.status(CREATED).json(user)
    } catch ({ message }) {
        res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const userLogin = async (req, res) => {
    const { statusCode, mensagem, ...registeredUser } = await validationUserRegisterOrLoginOrEdit(req.body, 'login')
    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    return res.status(OK).json(userAuth(registeredUser))
}

const getUserDetails = (req, res) => {
    return res.status(OK).json(req.user)
}

const editUser = async (req, res) => {
    const { statusCode, mensagem } = await validationUserRegisterOrLoginOrEdit(req.body, 'edit')
    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    editInfoUser(req.body, req.user.id)

    return res.status(NO_CONTENT).json()
}

module.exports = {
    registerUser,
    userLogin,
    getUserDetails,
    editUser
}

