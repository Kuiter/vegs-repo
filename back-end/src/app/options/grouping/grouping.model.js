const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Grouping determins the category selection 
 * if no children it is a "leaf" element 
 * leaf elements can be selected for items
 *  
 */

let TreeSchema = new Schema({
  name: String,
  description: String,
  owner: String,
  oldID: { type: String, default: '' },
  tree: [Object]
});

module.exports = mongoose.model('Tree', TreeSchema);