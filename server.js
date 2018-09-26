require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.static('dist'))
app.use(cookieParser())

app.listen(process.env.HTTP_PORT)
