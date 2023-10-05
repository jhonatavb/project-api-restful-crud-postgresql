const pool = require('../database/connection')

const selectUserTransactions = async (id) => {
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

        return await pool.query(query, [ id ])
    } catch ({ message }) {
        console.error(message)
    }
}

const getAllCategories = async () => {
    try {
        const query = 'SELECT * FROM categorias;'

        return await pool.query(query)
    } catch ({ message }) {
        console.log(message)
    }
}

module.exports = { 
    selectUserTransactions,
    getAllCategories 
}

