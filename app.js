var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var chalk = require('chalk')

var fbvnRouter = require('./routes/index')

var app = express()
global.logError = message => console.log(chalk.red(message))
global.logNotice = message => console.log(chalk.blue(message))
global.logSuccess = message => console.log(chalk.green(message))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({
  origin: process.env.NODE_ENV === 'prod' ? 'https://fbvn.org' : 'http://localhost:8080',
  credentials: true
}))

app.use('/api/fbvn', fbvnRouter)

module.exports = app
