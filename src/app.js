const express = require('express')
const app = express()

require('dotenv').config()

app.use(express.json())

const usersRoutes = require('./routes')

app.use('/', usersRoutes)

app.listen(process.env.port_express, () => {
    console.log(`server is running in port: ${ process.env.port_express }`)
})

