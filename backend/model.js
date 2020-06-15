const mongoose = require('mongoose')

const Schema = mongoose.Schema

let list = new Schema({
  name: {
    type: String,
  },
  items: {
    type: Array,
  },
  timestamp: {
    type: Number,
  },
})

module.exports = mongoose.model('list', list)
