const pool = require('../database/connection')
const { verifyFieldsTransaction } = require('../utils')

const { httpStatusCodes: { NOT_FOUND } } = require('../utils')

const selectUserTransactions = async (filtro, id) => {
    try {
        const query = `
            SELECT 
              transacoes.*, categorias.descricao AS categoria_nome
            FROM 
              transacoes
            JOIN
              categorias
            ON
              transacoes.categoria_id = categorias.id
            WHERE
              usuario_id = $1;
        `

        const { rows: getAllUserTransactions } = await pool.query(query, [ id ])

        if(filtro) {
            filtro = filtro.map(item => item.toLowerCase())
            const filteredTransactions = getAllUserTransactions.filter(({ categoria_nome }) => filtro.includes(categoria_nome.toLowerCase()))

            return filteredTransactions
        }

        return getAllUserTransactions
    } catch ({ message }) {
        throw new Error(message)
    }
}

const selectUserTransactionById = async (userId, idParams) => {
    const getTransactionById = await selectUserTransactions(null, userId)

    const foundTransaction = getTransactionById.filter(({ id }) => id === Number(idParams))
    if (!foundTransaction.length) return { statusCode: NOT_FOUND, mensagem: 'Transação não encontrada.' }

    return foundTransaction[0]
}

const userRegisterTransaction = async (body, id) => {
    const { descricao, valor, data, categoria_id, tipo } = body

    const { statusCode, mensagem } = await verifyFieldsTransaction(body)
    if (statusCode && mensagem) return { statusCode, mensagem }

    try {
        const query = 'INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id'
        const idTransaction = await pool.query(query, [ descricao, valor, data, categoria_id, id, tipo.toLowerCase() ])

        const allUserTransactions = await selectUserTransactions(null, id)
        const lastTransaction = allUserTransactions.filter(transaction => transaction.id === idTransaction.rows[0].id)
        
        return lastTransaction[0]
    } catch ({ message }) {
        throw new Error(message)
    }
}

const editTransactionUserById = async (body, id) => {
    const { descricao, valor, data, categoria_id, tipo } = body

    const { statusCode, mensagem } = await verifyFieldsTransaction(body)
    if (statusCode && mensagem) return { statusCode, mensagem }

    try {
        const query = 'UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6'
        await pool.query(query, [ descricao, valor, data, categoria_id, tipo, id ])

        return { statusCode: null, mensagem: null }
    } catch ({ message }) {
        throw new Error(message)
    }
}

const deleteTransactionId = async (idParams, idUser) => {
    try {
        const rows = await selectUserTransactions(null, idUser)

        const foundTransaction = rows.filter(({ id }) => id === Number(idParams))

        if (!foundTransaction.length) return { statusCode: NOT_FOUND, mensagem: 'Transação não encontrada.' }

        await pool.query('DELETE FROM transacoes WHERE id = $1', [ idParams ])

        return { statusCode: null, mensagem: null }
    } catch ({ message }) {
        throw new Error(message)
    }
}

const getSumStatement = async (idUser) => {
    try {
        const rows = await selectUserTransactions(null, idUser)

        const sumTotal = rows.reduce(({ entrada, saida }, { tipo, valor }) => {
            if (tipo.toLowerCase() === 'entrada') entrada += valor
            else saida += valor

            return { entrada, saida }
        }, { entrada: 0, saida: 0 })

        return sumTotal
    } catch ({ message }) {
        throw new Error(message)
    }
}

module.exports = {
    selectUserTransactions,
    selectUserTransactionById,
    userRegisterTransaction,
    editTransactionUserById,
    deleteTransactionId,
    getSumStatement
}

