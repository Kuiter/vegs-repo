const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SubjectSchema = new Schema({
  name: String, 
  reusable: Boolean,
  owner: String
}, { timestamps: true });



module.exports = mongoose.model('Subject', SubjectSchema);