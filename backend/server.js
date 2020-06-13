const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
let detail = require('./model')

const PORT = 4000

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))

app.get('/getData', function (req, res) {
  detail.find({}, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

mongoose.connect('mongodb://127.0.0.1:27017/details', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const connection = mongoose.connection

connection.once('open', function () {
  console.log('Connection with MongoDB was successful')
})

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT)
})
