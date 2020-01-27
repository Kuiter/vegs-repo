// var verifySession = require('../session/session.middleware');
var verifySession = require('../auth/verifytoken.middleware');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const Treatment = mongoose.model('Treatment');

module.exports = function (app) {
  // let session = require('./subject.controller');

  app.route('/subject')
    .get(
      (req, res) => {
        Subject.find({}, (err, subjects) => {
          if (err) { return res.status(500).send(err) }
          if (!subjects) { return res.status(404).send({ msg: 'No Subjects found' }) }
          res.send(subjects);
        })
      }
    )

  // create Subject pre experiment probably reusable?
  app.post(
    '/subject/new',
    verifySession,
    (req, res) => {
      let resObj = {};
      Object.assign(resObj, req.body);
      resObj.owner = req.user.username;
      let subject = new Subject(resObj);
      subject.save()
        .then(
          (newSub) => {
            res.send(newSub);
          }
        )
        .catch((val) => { return res.status(500).send(val) })
    }
  );
  // create subject before starting treatment
  app.post(
    '/subject/create/:treatmentID',
    (req, res) => {
      const { treatmentID } = req.params;
      const query = Treatment.findById(treatmentID).select('-items');
      query.exec(async (err, treatment) => {
        if (err) { return res.status(500).send(err) }
        if (!treatment) { return res.status(404).send('No treatment found.') }
        let resObj = req.body;
        resObj.owner = treatment.owner;
        let subject = new Subject(resObj);
        try {
          const sub = await subject.save();
          return res.send(sub._id);
        } catch (e) {
          return res.status(500).send(e);
        }
      })
      // Treatment.findById(req.params.treatmentID, async (err, treatment) => {
      //   if (err) { return res.status(500).send(err) }
      //   if (!treatment) { return res.status(404).send('No treatment found.') }
      //   let resObj = req.body;
      //   resObj.owner = treatment.owner;
      //   let subject = new Subject(resObj);
      //   try {
      //     const sub = await subject.save();
      //     return res.send(sub._id);
      //   } catch (e) {
      //     return res.status(500).send(e)
      //   }
      // });
    }
  )
}