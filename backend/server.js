const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const list = require('./model')

const PORT = 443

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

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
    _handleMissingParameter(req.query.name)
    const item = await list.findOne({ name: req.query.name })
    res.send(item)
  } catch (error) {
    res.send(error)
  }
})

app.post('/save', async function (req, res) {
  try {
    _handleMissingParameter(req.body.name)
    const item = await list.findOne({ name: req.body.name })
    if (item && item.timestamp < req.body.timestamp) {
      // item exists and is older -> update
      let filter = { name: req.body.name }
      let update = req.body
      let options = {
        new: true,
        upsert: true,
      }
      let doc = await list.findOneAndUpdate(filter, update, options)
      console.log('updated:', doc)
      res.send('save')
    } else if (!item) {
      // insert new item
      const newItem = new list(req.body)
      let saveItem = await newItem.save()
      console.log('inserted', saveItem)
      res.send('save')
    } else {
      console.log('made no entry')
      res.send('made no entry')
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.get('/deleteOne', async function (req, res) {
  try {
    _handleMissingParameter(req.query.name)
    const item = await list.findOneAndDelete({ name: req.query.name })
    console.log('deleted', item)
    res.send(item)
  } catch (error) {
    res.send(error)
  }
})

//server
const https_options = {
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

//helper
const _handleMissingParameter = (parameter) => {
  if (parameter === undefined || parameter.length === 0) {
    throw {
      name: 'DBException',
      message: 'No name parameter',
      toString: function () {
        return this.name + ': ' + this.message
      },
    }
  }
}
