const mongoose = require('mongoose');
let Schema = mongoose.Schema;


// parent Schema
/**
 * Item Schema definition
 * 
 * This model represents the item structure with all attributes present
 */
let ItemSchema = new Schema({
  // for determining the item pool of an authenticated user 
  owner: String,
  // reference to the previous item defintion, before addition to a treatment
  oldID: { type: String, default: '' },
  // for managing and using an externalID
  externalID: {type: String, default: ''}, 
  // For display purposes
  name: { type: String },
  brand: { type: String },
  description: [
    {
      header: { type: String },
      text: { type: String },
    }
  ],
  nutritionalTable: {
    kj: { type: Number },
    kcal: { type: Number },
    totalFat: { type: Number },
    saturatedFat: { type: Number },
    totalCarbohydrate: { type: Number },
    sugar: { type: Number },
    protein: { type: Number },
    salt: { type: Number },
    // additionalInformation: []
  },
  netPrice: { type: Number },
  currency: { type: String },
  vat: { type: Number },
  amount: { type: Number },
  content: {
    contentType: String, // fluid or solid 
    amountInKG: { type: Number },
    displayAmount: { type: String }
  },
  // In frontend thumbnails will be handeled by `th_+imageID`
  image: {
    th: String,
    full: String
  },

  ingredients: { type: String },
  allergens: { type: String },
  baseAttributes: [String],

  // superGroup: { type: String },
  // subGroup: { type: String },
  // options that are assigned through reference by ID
  taxes: [{
    taxID: String,
    header: String,
    description: String,
    shortDescription: String,
    amount: Number
  }],
  score: {
    scoreID: String,
    header: String,
    description: String,
    maxValue: Number,
    minValue: Number,
    amount: { type: Number },
  },
  subsidies: {
    subsedieID: String,
    amount: Number
  },
  // ItemIds 
  swaps: [String],
  label: [String],
  // for base Filter funtionality?
  tags: [String],
  niceness: { type: Number, default: 1 }
  // maybe additionally contact details?
  // upselling may be differently
  // upselling: {}
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);