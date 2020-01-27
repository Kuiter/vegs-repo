const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  owner: String,
  header: String,
  description: String, 
  maxValue: Number, 
  minValue: Number, 
});

module.exports = mongoose.model('Score', ScoreSchema);