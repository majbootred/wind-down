const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const https = require('https')
let list = require('./model')

const PORT = 443

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))

//db connect
mongoose.connect('mongodb://127.0.0.1:27017/lists', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const connection = mongoose.connection

connection.once('open', function () {
  console.log('Connection with MongoDB was successful')
})

connection.on('error', (err) => {
  console.error('connection error:', err)
})

//routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

app.get('/getAll', async function (req, res) {
  try {
    const items = await list.find()
    res.send(items)
  } catch (error) {
    res.send(error)
  }
})

app.get('/getOne', async function (req, res) {
  try {
    if (req.query.name === undefined || req.query.name.length === 0) {
      throw {
        name: 'DBException',
        message: 'No name parameter in query',
        toString: function () {
          return this.name + ': ' + this.message
        },
      }
    }
    const item = await list.find({ name: req.query.name })
    res.send(item)
  } catch (error) {
    res.send(error)
  }
})

//server
var https_options = {
  key: fs.readFileSync('certificates/privkey.pem'),

  cert: fs.readFileSync('certificates/cert.pem'),

  ca: [
    fs.readFileSync('certificates/chain.pem'),

    fs.readFileSync('certificates/fullchain.pem'),
  ],
}

const server = https.createServer(https_options, app)
server.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${PORT}`)
})
