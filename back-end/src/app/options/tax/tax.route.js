const mongoose = require('mongoose');
const Tax = mongoose.model('Tax');

var verifySession =require('../../auth/verifytoken.middleware');

module.exports = function (app) {

  app.get(
    '/options/tax',
    verifySession,
    (req, res) => {
      Tax.find({ owner: req.user._id })
        .exec()
        .catch((err) => { return res.status(500).send(err) })
        .then((taxes) => {
          return res.status(200).send(taxes)
        })
    }
  );

  app.post(
    '/options/tax',
    verifySession,
    (req, res) => {
      let tax = new Tax(req.body);
      tax.owner = req.user._id;
      tax.save()
        .catch((err) => { return res.status(500).send(err) })
        .then((newTax) => { return res.status(200).send(newTax) })
    }
  );

  app.put(
    '/options/tax/:taxID',
    verifySession,
    (req, res) => {
      Tax.findById(req.params.taxID)
        .exec()
        .catch((err) => { return res.status(500).send(err) })
        .then((tax) => {
          Object.assign(tax, req.body);
          tax.save()
            .catch((err) => { return res.status(500).send(err) })
            .then((newTax) => { return res.status(200).send(newTax) })
        });
    }
  );

  app.get('/options/allTax', (req, res) => {
    Tax.find({}, (err, groups) => {
      if (err) { return res.status(500).send(err); }
      res.send(groups)
    });
  });
}