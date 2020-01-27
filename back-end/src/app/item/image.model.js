const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ImageSchema = new Schema({
  img: {
    imageID: String,
    data: Buffer,
    contentType: String
  }
})

module.exports = mongoose.model('Image', ImageSchema);