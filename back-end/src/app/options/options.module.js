/**
 * Module for importing and providing options subset more easily
 */

module.exports = function (app, acl) {
  // import models
  const LabelModel = require('./label/label.model'),
  GroupingModel = require('./grouping/grouping.model'),
  TaxModel = require('./tax/tax.model')
  ScoreModel = require('./score/score.model');

  // use routes
  const labelRoute = require('./label/label.route')(app, acl),
  taxRoute = require('./tax/tax.route')(app, acl),
  groupingRoute = require('./grouping/grouping.route')(app, acl)
  scoreRoute = require('./score/score.route')(app, acl);
}


