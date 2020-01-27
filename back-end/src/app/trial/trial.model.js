/**shared instance of mongoose configuration */
const mongoose = require('mongoose');
/**Schema refrence */
let Schema = mongoose.Schema;

/**
 * Trial Schema definition,
 * 
 * This Model represents all data that is being recorded during 
 * a experiment run. 
 */
let TrialSchema = new Schema({
  treatmentID: String,
  subjectID: String,
  started: String, 
  ended: String,
  owner: String,
  finished: { type: Boolean, default: false },
  userAgentHeader: String,
  deviceWidth: Number,
  deviceHeight: Number,
  data: {
    // routes visited and navigated
    routing: [
      {
        origin: String,
        destination: String,
        time: String
      }
    ],
    pagination: [
      {
        currentPage: Number,
        pageSize: Number,
        itemsOnPage: Array,
        numInTotal: Number,
        time: String
      }
    ],
    finalCart: [
      {
        itemID: String,
        amount: Number
      }
    ],
    transaction: [
      {
        time: String,
        itemID: String,
        identifier: String,
        delta: Number
      }
    ],
    swaps: [
      {
        started: String,
        ended: String,
        originalItem: String,
        originalAmount: Number,
        resultItem: String,
        resultAmount: String,
        swapOptions: [String],
        success: Boolean
      }
    ],
    swapOpts: [
      {
        sourceItem: String,
        rememberMyAnswer: Boolean,
        result: Boolean
      }
    ],
    infoViewed: [
      {
        started: String,
        ended: String,
        infoID: String
      }
    ],
    itemsFiltered: [
      {
        time: String,
        filter: Object
      }
    ]
  },
  questionnaire: { 
    personalInfo: Object, 
    questions1: Object,
    questions2: Object,
  }
}, { timestamps: true }).index({treatmentID: 1, subjectID: 1});
/**Nested schema for shopping cart */
let CartSchema = new Schema({
  treatmentID: String,
  subjectID: String,
  cart: [Object]
});

module.exports = mongoose.model('Trial', TrialSchema);
module.exports = mongoose.model('Cart', CartSchema);