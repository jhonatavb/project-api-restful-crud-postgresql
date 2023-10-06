const pool = require('../database/connection')

const getAllCategories = async () => {
    try {
        return await pool.query('SELECT * FROM categorias')
    } catch ({ message }) {
        throw new Error(message)
    }
}

module.exports = { 
    getAllCategories 
}

