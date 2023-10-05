const express = require('express')
const router = express.Router()

const { verifyUserLogin } = require('../middlewares')

const { userControllers, categoryControllers, transactionControllers } = require('../controllers')

const { registerUser, userLogin, getUserDetails, editUser } = userControllers

const { listAllCategories } = categoryControllers

const { listAllUserTransaction,
    listTransactionUserById,
    registerTransactionLoggedUser,
    editUserTransactionById,
    deleteTransactionById,
    getTransactionStatement } = transactionControllers

router.post('/usuario', registerUser)
router.post('/login', userLogin)

router.use(verifyUserLogin)
router.get('/usuario', getUserDetails)
router.put('/usuario', editUser)

router.get('/categoria', listAllCategories)

router.get('/transacao', listAllUserTransaction)
router.get('/transacao/extrato', getTransactionStatement)
router.get('/transacao/:id', listTransactionUserById)
router.post('/transacao', registerTransactionLoggedUser)
router.put('/transacao/:id', editUserTransactionById)
router.delete('/transacao/:id', deleteTransactionById)

module.exports = router

