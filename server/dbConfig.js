const {Pool} = require("pg")
const dotenv = require('dotenv').config();

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: "postgres",
    password: process.env.DATABASE_PASSWORD
})

module.exports = {pool}