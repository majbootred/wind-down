const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const https = require('https')
let detail = require('./model')

const PORT = 443

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))

//db connect
mongoose.connect('mongodb://127.0.0.1:27017/details', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const connection = mongoose.connection

connection.once('open', function () {
  console.log('Connection with MongoDB was successful')
})

//routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

app.get('/getData', function (req, res) {
  detail.find({}, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
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

// app.listen(PORT, function () {
//   console.log('Server is running on Port: ' + PORT)
// })
