const { Pool } = require('pg')

const { host, port_db, user, password, database } = process.env

const poolConf = {
    host,
    port_db,
    user,
    password,
    database
}

const pool = new Pool(poolConf)

module.exports = pool

