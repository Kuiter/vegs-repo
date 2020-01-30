const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = mongoose.model('Item').schema;
const Tree = mongoose.model('Tree').schema;


let TreatmentSchema = new Schema({
  owner: String,
  name: String,
  description: String,
  active: {type: Boolean, default: false},
  // embedded items with full items (new items for each treatment)
  items: [Item],
  featuredItems: [String],
  // subjects: [String],
  filters: [Tree],
  showOptions: {
    numOfItems: { type: Number, default: 10 },
    showSum: { type: Boolean, default: false },
    showSumScore: { type: Boolean, default: false },
    showBudget: { type: Boolean, default: false },
    showScore: { type: Boolean, default: false },
    showTax: { type: Boolean, default: false },
    // also for the metric component...
    showPopOverCart: { type: Boolean, default: false }
  },
  swapConfig: {
    // if swaps are shown at all
    showSwaps: { type: Boolean, default: false },
    // if swaps are shown immediatly or at the end
    showSwapEnd: { type: Boolean, default: false },
    showOptInStart: { type: Boolean, default: false },
    showOptInEachTime: { type: Boolean, default: false }
  },
  subjectOptions: {
    money: Number,
    restricted: Boolean,
    minAmountOfItemsPurchased: Number
  },
  // sharing options?
  questionnaire: { type: Boolean, default: false }
  // UI Options

}, { timestamps: true });

module.exports = mongoose.model('Treatment', TreatmentSchema);