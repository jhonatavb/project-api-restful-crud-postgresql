const pool = require('../database/connection')
const { compare } = require('bcrypt')

const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT } = require('./httpStatusCodes')

const verifyFieldsTransaction = async (body) => {
    const args = Object.values(body)

    const transaction = args.map(field => typeof field === 'string' ? field.toLowerCase() : field)

    const NUM_MIN_FIELDS = 5

    if (transaction.length !== NUM_MIN_FIELDS) return { statusCode: BAD_REQUEST, mensagem: 'Todos os campos obrigatórios devem ser informados.' }
    const transactionTypes = [ 'entrada', 'saida' ]
    
    const correctType = transaction.some(field => transactionTypes.includes(field))
    if (!correctType) return { statusCode: NOT_FOUND, mensagem: 'O tipo informado na transação é inválido.' }

    try {
        const query = 'SELECT * FROM categorias;'
        const { rows } = await pool.query(query)

        if (rows.length === 0) return { statusCode: NOT_FOUND, mensagem: 'Nenhuma categoria cadastrada no banco de dados.' }

        const categoryExists = rows.some(category => category.id === body.categoria_id)

        if(!categoryExists) return { statusCode: NOT_FOUND, mensagem: 'A categoria informada não existe.' }

        return { statusCode: null, mensagem: null }
    } catch ({ message }) {
        throw new Error(message)
    }
}

const userExists = async (email) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])

        if (rows.length) return rows

        return false
    } catch ({ message }) {
        throw new Error(message)
    }
}

const validationUserRegisterOrLoginOrEdit = async (body, type) => {
    const arrFields = Object.keys(body)
    const nameFields = arrFields.map(field => field.toLowerCase())
    const registeredUser = await userExists(body.email)

    const requiredFieldsRegisterOrEdit = [ 'nome', 'email', 'senha' ]
    const requiredFieldsLogin = [ 'email', 'senha' ]

    const validateFields = (nameFields, requiredFields) => requiredFields.every(field => nameFields.includes(field))

    if (type === 'register') {
        if (!validateFields(nameFields, requiredFieldsRegisterOrEdit)) return { statusCode: BAD_REQUEST, mensagem: 'Por favor, informe todos os campos!' }
        if (registeredUser) return { statusCode: CONFLICT, mensagem: 'Já existe usuário cadastrado com o e-mail informado.' }
    }

    if (type === 'login') {
        if (!validateFields(nameFields, requiredFieldsLogin)) return { statusCode: BAD_REQUEST, mensagem: 'Por favor, informe os campos email e senha!' }
        if (!registeredUser) return { statusCode: UNAUTHORIZED, mensagem: 'Usuário e/ou senha inválido(s).' }

        const userPasswordValid = await compare(body.senha, registeredUser[0].senha)
        if (!userPasswordValid) return { statusCode: UNAUTHORIZED, mensagem: 'Usuário e/ou senha inválido(s).' }

        return registeredUser[0]
    }

    if (type === 'edit') {
        if (!validateFields(nameFields, requiredFieldsRegisterOrEdit)) return { statusCode: BAD_REQUEST, mensagem: 'Por favor, informe todos os campos!' }
        if (registeredUser) return { statusCode: BAD_REQUEST, mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' }
    }

    return { statusCode: null, mensagem: null }
}

module.exports = { 
    verifyFieldsTransaction,
    userExists,
    validationUserRegisterOrLoginOrEdit 
}

