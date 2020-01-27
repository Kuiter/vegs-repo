/**shared instance of mongoose configuration */
const mongoose = require('mongoose');
/**Import for Collection trial */
const Trial = mongoose.model('Trial');
const Treatment = mongoose.model('Treatment');

/**
 * Middleware function which is invocted before any route definition where
 * it is important that the referenced trial is present, and is not finished
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function trialActive(req, res, next) {
  // check if Treatment active
  const { treatmentID, subjectID } = req.params;
  Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
    if (err) { return res.status(500).send(err) }
    if (!trial) { return res.status(404).send('No trial found') }
    if (trial.finished) {
      return res.status(400).send('Trial already conducted')
    }
    next();
  });

}

module.exports = trialActive;