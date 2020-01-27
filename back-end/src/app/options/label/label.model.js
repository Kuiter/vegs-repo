const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LabelSchema = new Schema({
  owner: String,
  header: String,
  description: String,
  img: {
    imageID: String,
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Label', LabelSchema);