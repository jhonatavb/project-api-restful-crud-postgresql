const pool = require('../database/connection')
const { verifyFieldsTransaction, selectUserTransactions, httpStatusCodes } = require('../utils')

const { OK, NO_CONTENT, NOT_FOUND, INTERNAL_SERVER_ERROR } = httpStatusCodes

const listAllUserTransaction = async (req, res) => {
    const { filtro } = req.query

    try {
        const transactionsFullDescription = await selectUserTransactions(req.user.id)

        if(filtro) {
            const transactionsFilter = transactionsFullDescription.filter(transaction => {
                const categoryLowerCase = transaction.categoria_nome.toLowerCase()
                const filtroLowerCase = filtro.map(filtro => filtro.toLowerCase())
                return filtroLowerCase.includes(categoryLowerCase)
            })

            return res.status(OK).json(transactionsFilter)
        }

        return res.status(OK).json(transactionsFullDescription.rows)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const listTransactionUserById = async (req, res) => {
    const { id } = req.params

    try {
        const { rows } = await selectUserTransactions(req.user.id)

        const foundTransaction = rows.filter(transaction => transaction.id === Number(id))

        if (!foundTransaction.length) return res.status(NOT_FOUND).json({ mensagem: 'Transação não encontrada.' })

        return res.status(OK).json(foundTransaction[0])
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const registerTransactionLoggedUser = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { statusCode, mensagem } = await verifyFieldsTransaction(req.body)

    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    try {
        const idTransaction = await pool.query('INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [ descricao, valor, data, categoria_id, req.user.id, tipo ])

        const allUserTransactions = await selectUserTransactions(req.user.id)
        const lastTransaction = allUserTransactions.rows.filter(transaction => transaction.id === idTransaction.rows[0].id)
        
        return res.status(OK).json(lastTransaction[0])

    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const editUserTransactionById = async (req, res) => {
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    const { statusCode, mensagem } = await verifyFieldsTransaction(req.body)

    if (statusCode && mensagem) return res.status(statusCode).json({ mensagem })

    try {
        await pool.query('UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6', [ descricao, valor, data, categoria_id, tipo, id ])

        return res.status(NO_CONTENT).json()

    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const deleteTransactionById = async (req, res) => {
    const { id } = req.params

    try {
        const { rows } = await selectUserTransactions(req.user.id)

        const foundTransaction = rows.filter(transaction => transaction.id === Number(id))

        if (!foundTransaction.length) return res.status(NOT_FOUND).json({ mensagem: 'Transação não encontrada.' })

        await pool.query('DELETE FROM transacoes WHERE id = $1', [ id ])

        return res.status(NO_CONTENT).json()
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

const getTransactionStatement = async (req, res) => {
    try {
        const { rows } = await selectUserTransactions(req.user.id)

        const sumTotal = rows.reduce((acc, curr) => {
            if (curr.tipo.toLowerCase() === 'entrada') acc.entrada += curr.valor
            else if (curr.tipo.toLowerCase() === 'saida') acc.saida += curr.valor

            return acc
        }, { entrada: 0, saida: 0 })

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

