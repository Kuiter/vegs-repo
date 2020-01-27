const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TaxSchema = new Schema({
  owner: String,
  description: String, 
  shortDescription: String,
  header: String
});

module.exports = mongoose.model('Tax', TaxSchema);