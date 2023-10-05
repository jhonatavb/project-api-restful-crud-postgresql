const { getAllCategories, httpStatusCodes } = require('../utils')
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes

const listAllCategories = async (req, res) => {
    try {
        const allCategories = await getAllCategories()

        return res.status(OK).json(allCategories.rows)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

module.exports = {
    listAllCategories
}

