const pool = require('../database/connection')
const { selectUserTransactions, 
    selectUserTransactionById, 
    userRegisterTransaction, 
    editTransactionUserById, 
    deleteTransactionId, 
    getSumStatement } = require('../services')
const { httpStatusCodes: { OK, NO_CONTENT, INTERNAL_SERVER_ERROR } } = require('../utils')

const listAllUserTransaction = async (req, res) => {
    try {
        const getAllUserTransactions = await selectUserTransactions(req.query.filtro, req.user.id)

        return res.status(OK).json(getAllUserTransactions)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const listTransactionUserById = async (req, res) => {
    try {
        const { statusCode, mensagem, ...foundTransaction } = await selectUserTransactionById(req.user.id, req.params.id)
        if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

        return res.status(OK).json(foundTransaction)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const registerTransactionLoggedUser = async (req, res) => {
    try {
        const { statusCode, mensagem, ...lastTransaction } = await userRegisterTransaction(req.body, req.user.id)
        if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

        return res.status(OK).json(lastTransaction)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const editUserTransactionById = async (req, res) => {
    try {
        const { statusCode, mensagem } = await editTransactionUserById(req.body, req.params.id)
        if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

        return res.status(NO_CONTENT).json()
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const deleteTransactionById = async (req, res) => {
    try {
        const { statusCode, mensagem } = await deleteTransactionId(req.params.id, req.user.id)
        if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

        return res.status(NO_CONTENT).json()
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const getTransactionStatement = async (req, res) => {
    try {
        const sumTotal = await getSumStatement(req.user.id)

        return res.status(OK).json(sumTotal)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

module.exports = {
    listAllUserTransaction,
    listTransactionUserById,
    registerTransactionLoggedUser,
    editUserTransactionById,
    deleteTransactionById,
    getTransactionStatement
}

