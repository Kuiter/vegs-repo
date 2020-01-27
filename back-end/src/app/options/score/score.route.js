const mongoose = require('mongoose');
const Score = mongoose.model('Score');

const verifySession =require('../../auth/verifytoken.middleware');

module.exports = function (app) {

  app.post(
    '/score',
    verifySession,
    (req, res) => {
      let score = new Score(req.body);
      score.owner = req.user._id;
      score.save()
        .catch((err) => { return res.status(500).send(err) })
        .then((newScore) => {
          return res.status(200).send(newScore);
        })
    }
  );

  app.get(
    '/score',
    verifySession,
    (req, res) => {
      Score.find({ owner: req.user._id })
        .exec()
        .catch((err) => { return res.status(500).send(err) })
        .then((score) => {
          // if(score.length == 0) {
          //   return res.status(200).send(score);
          // }
          return res.status(200).send(score);
        })
    }
  );

  app.put(
    '/score/:scoreID',
    verifySession,
    (req, res) => {
      Score.findById(req.params.scoreID)
        .exec()
        .catch((err) => { return res.status(500).send(err) })
        .then((score) => {
          Object.assign(score, req.body)
          score.save()
            .catch((err) => { return res.status(500).send(err) })
            .then((newScore) => {
              return res.status(200).send(newScore);
            })
        })
    }
  );

  app.delete(
    '/score/:scoreID',
    verifySession,
    (req, res) => {
      Score.deleteOne({_id: req.params.scoreID}, (err, del) => {
        if (err) { return res.status(500).send(err) }
        return res.status(200).send(del);
      })
    }
  );




  // ========= non API test 

  app.get(
    '/all_score',
    // verifySession,
    (req, res) => {
      Score.find({}, (err, scores) => {
        if (err) { return res.status(500).send(err) }
        return res.status(200).send(scores);
      })
    }
  );

  app.delete(
    '/all_score',
    // verifySession,
    (req, res) => {
      Score.deleteMany({}, (err, scores) => {
        if (err) { return res.status(500).send(err) }
        return res.status(200).send(scores);
      })
    }
  );

}