const { getAllCategories } = require('../services')
const { httpStatusCodes: { OK, INTERNAL_SERVER_ERROR } } = require('../utils')

const listAllCategories = async (_, res) => {
    try {
        return res.status(OK).json((await getAllCategories()).rows)
    } catch ({ message }) {
        return res.status(INTERNAL_SERVER_ERROR).json(message)
    }
}

module.exports = {
    listAllCategories
}

