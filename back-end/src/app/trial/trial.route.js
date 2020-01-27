/**shared instance of mongoose configuration */
const mongoose = require('mongoose');
/**imports for collection definitions needed in the route */
const Trial = mongoose.model('Trial');
const Treatment = mongoose.model('Treatment');
const Subject = mongoose.model('Subject');
const Cart = mongoose.model('Cart');
/**Necessary middleware function */
const verifySession = require('../auth/verifytoken.middleware');
const checkActiveTrial = require('./trial-active.middleware');

/**Registered middleware definitions for http endpoints */
module.exports = function (app) {
  // for checking on reload or when calling only by route '/t/.../s/.../shop
  /**
   * Endpoint for checking if referenced trial exists
   * @param treatmentID
   * @param subjectID
   */
  app.get(
    '/check/trial/:treatmentID/:subjectID',
    async (req, res) => {
      const {treatmentID, subjectID} = req.params;
      try {
        const trial = await Trial.findOne({treatmentID, subjectID});
        if (!trial) { return res.status(404).send({ noTrial: true, msg: 'No Trial ref found' }) }
        return res.status(200).send(trial);
      } catch(error) {
        return res.status(500).send(error);
      }
      // Treatment.findById(req.params.treatmentID, (err, treatment) => {
      //   if (err) { return res.status(500).send(err) }
      //   if (!treatment) { return res.status(404).send({ noTreatment: true, msg: 'No Trial ref found' }) }
      // });
      // Trial.findOne({ treatmentID: req.params.treatmentID, subjectID: req.params.subjectID }, (err, trial) => {
      //   if (err) { return res.status(500).send(err) }
      //   if (!trial) { return res.status(404).send({ noTrial: true, msg: 'No Trial ref found' }) }
      //   res.send(trial);
      // })
    }
  );

  /**
   * Get route for getting all data connected to a treatmentID
   * @param treatmentID
   */
  app.get(
    '/download/data/:treatmentID',
    verifySession,
    (req, res) => {
      Trial.find({ treatmentID: req.params.treatmentID }, (err, data) => {
        if (err) { return res.status(500).send(err) }
        if (!data) { return res.status(404).send('No treatment data present') }
        res.send(data);
      });
    }
  )

  // called when trial start!
  /**
   * Endpoint for starting a trial.
   * First data is recorded, like User Agent and device data
   * @param treatmentID
   * @param subjectID
   */
  app.post(
    '/start/trial/:treatmentID/:subjectID',
    (req, res) => {
      const { treatmentID, subjectID } = req.params;
      // check if trial already exists
      let p = new Promise((resolve, reject) => {
        Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
          if (err) { reject(err) }
          if (!trial) { resolve('No trial found') }
          reject(trial);
        })
      })
      p
        .then(() => {
          // check if treatment and subject exist?
          let resObj = {};
          const query = Treatment.findById(treatmentID).select('-items');
          query.exec((err, treatment) => {
            if (err) { return res.status(500).send(err) }
            if (!treatment) { return res.status(404).send({ msg: 'No treatment found!' }) }
            const { deviceWidth, deviceHeight } = req.body;
            resObj = {
              deviceWidth,
              deviceHeight,
              treatmentID: treatment._id,
              owner: treatment.owner,
              userAgentHeader: !!req.header('User-Agent') ? req.header('User-Agent') : ''
            }
            Subject.findById(req.params.subjectID, (err, subject) => {
              if (err) { return res.status(500).send(err) }
              if (!subject) { return res.status(404).send({ msg: 'No subject found!' }) }
              resObj.subjectID = subject._id;
              let trial = new Trial(resObj);
              trial.started = new Date().toISOString();
              trial.save()
                .then((t) => { res.send(t) })
                .catch((val) => { res.status(500).send(val) })
            })
          })
        })
        .catch((val) => {
          if (val instanceof Error) {
            return res.status(500).send(val);
          }
          res.send(val);
        })
    }
  );

  // called when recording ends
  /**
   * Enpoint for ending the trial recording.
   * set flag finished true. (Is also checked in checkActiveTrial)
   * @param treatmentID
   * @param subjectID
   */
  app.put(
    '/end/trial/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      Trial.findOne({ treatmentID: req.params.treatmentID, subjectID: req.params.subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial Found') }
        trial.finished = true;
        trial.ended = new Date().toISOString();
        // if (req.body.cart.length > 0) {
        //   req.body.cart.forEach(element => {
        //     trial.data.finalCart.push({
        //       itemID: element.item._id,
        //       amount: element.amount
        //     })
        //   });
        // }
        trial.save().then((t) => {
          res.send(t);
        })
      });
    }
  );

  /**
   * Push swap information to swapOpts trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/swapOpts/:treatmentID/:subjectID',
    checkActiveTrial,
    async (req, res) => {
      const data = req.body;
      const {treatmentID, subjectID} = req.params;
      let trial = await Trial.findOne({ treatmentID, subjectID });
      if (!trial) { return res.status(404).send('No Trial Found') }
      if (!trial.swapOpts) { trial.swapOpts = [] }
      trial.swapOpts.push(data);
      const newTrial = await trial.save();
      return res.send(newTrial);
    }
  )

  /**
   * Pagination data recording endpoint
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/pagination/:treatmentID/:subjectID',
    checkActiveTrial,
    async (req, res) => {
      let data = req.body;
      const {treatmentID, subjectID} = req.params;
      let trial = await Trial.findOne({ treatmentID, subjectID });
      if (!trial) { return res.status(404).send('No Trial Found') }
      if (!trial.data.pagination) { trial.data.pagination = [] }
      data.time = new Date().toISOString();
      trial.data.pagination.push(data);
      await trial.save();
      return res.send();
    }
  );

  // calles when checked out // for questionnaire purposes
  /**
   * Shopping cart data recording route for final shopping cart
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/end/shoppingCart/:treatmentID/:subjectID',
    checkActiveTrial,
    async (req, res) => {
      const {treatmentID, subjectID} = req.params;
      let trial = await Trial.findOne({ treatmentID, subjectID });
      if (!trial) { return res.status(404).send('No Trial Found') }
      if (req.body.cart.length > 0) {
        req.body.cart.forEach(element => {
          trial.data.finalCart.push({
            itemID: element.item._id,
            amount: element.amount
          })
        });
      }
      const newTrial = await trial.save();
      return res.status(200).send(newTrial);
    }
  )

  // add swap
  /**
   * Push swap information to swap trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/swap/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial found?') }
        if (!trial.data.swaps) {
          trial.data.swaps = [];
        }
        trial.data.swaps.push(req.body);
        trial.save()
          .then(
            () => {
              res.status(200).send({ msg: 'success' });
            }
          )
          .catch((val) => { res.status(500).send(val) })
      });
    }
  );

  // filter events
  /**
   * Push filter information to trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/filter/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial found?') }
        if (!trial.data.swaps) {
          trial.data.itemsFiltered = [];
        }
        trial.data.itemsFiltered.push(req.body)
        trial.save()
          .catch((err) => { return res.status(500).send(err) })
          .then(() => {
            return res.status(200).send({ msg: 'success' });
          })
      })
    }
  )

  // add info viewd
  /**
   * Push info viewed data information to trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/info/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial found?') }
        if (!trial.data.infoViewed) { trial.data.infoViewed = [] }
        trial.data.infoViewed.push(req.body);
        trial.save()
          .then(
            () => {
              res.status(200).send({ msg: 'success' });
            }
          )
          .catch((val) => { res.status(500).send(val) })
      });
    }
  );

  // routing 
  /**
   * Push routing information to trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/routing/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial found?') }
        if (!trial.data.routing) {
          trial.data.routing = [];
        }
        trial.data.routing.push(req.body);
        trial.save()
          .then(
            () => {
              res.status(200).send({ msg: 'success' });
            }
          )
          .catch((val) => { res.status(500).send(val) })
      });
    }
  );

  // shopping cart add item etc.
  /**
   * Push transaction information to trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/transaction/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        if (err) { return res.status(500).send(err) }
        if (!trial) { return res.status(404).send('No Trial found?') }
        if (!trial.data.transaction) {
          trial.data.transaction = [];
        }
        let obj = {
          time: req.body.time,
          itemID: req.body.itemID,
          identifier: req.body.identifier,
          delta: req.body.delta
        };
        trial.data.transaction.push(obj);
        trial.save()
          .then(
            () => {
              res.status(200).send({ msg: 'success' });
            }
          )
          .catch((val) => { res.status(500).send(val) })
      });
    }
  );

  // final cart after experiment end
  /**
   * Push swap information to swapOpts trial data
   * @param treatmentID
   * @param subjectID
   * @param body
   */
  app.put(
    '/trial/finalCart/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      const {treatmentID, subjectID} = req.params;
      Trial.findOne({ treatmentID, subjectID }, (err, trial) => {
        trial.data.finalCart = req.body.cart;
        trial.save()
          .then(
            () => {
              res.status(200).send({ msg: 'success' });
            }
          )
          .catch((val) => { res.status(500).send(val) })
      });
    }
  );

  // current cart?
  app.get(
    '/trial/currentCart/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      Cart.findOne({ treatmentID: req.params.treatmentID, subjectID: req.params.subjectID }, (err, sCart) => {
        if (err) { return res.status(500).send(err) }
        if (!sCart) { return res.status(200).send([]) }
        res.send(sCart.cart);
      });
    }
  );

  // Save and update current shopping cart
  app.put(
    '/trial/currentCart/:treatmentID/:subjectID',
    checkActiveTrial,
    (req, res) => {
      Cart.findOne({ treatmentID: req.params.treatmentID, subjectID: req.params.subjectID }, (err, sCart) => {
        if (err) { return res.status(500).send(err) }
        // if no cart is saved yet
        if (!sCart) {
          let obj = {
            treatmentID: req.params.treatmentID,
            subjectID: req.params.subjectID,
          }
          obj.cart = req.body;
          let saveCart = new Cart(obj);
          saveCart.save().then((nC) => {
            res.send(nC.cart);
          });
        } else {
          // when cart is saved
          sCart.cart = req.body.cart;
          sCart.save()
            .then(
              (nC) => {
                res.send(nC);
              }
            )
            .catch((val) => {
              res.status(500).send(val);
            })
          res.send(sCart.cart);
        }
      });
    }
  );

  // save and update questionnaire data
  app.put(
    '/trial/questionnaire/:treatmentID/:subjectID',
    checkActiveTrial,
    async (req, res) => {
      const {treatmentID, subjectID} = req.params;
      let trial = await Trial.findOne({ treatmentID, subjectID })
      if (!trial) { return res.status(404).send({ msg: 'no trial found' }) }
      const {questions1, questions2, personalInfo} = req.body;
      questions1 ? trial.questionnaire.questions1 = questions1 : null;
      questions2 ? trial.questionnaire.questions2 = questions2 : null;
      personalInfo ? trial.questionnaire.personalInfo = personalInfo : null;
      try {
        const newTrial = await trial.save();
        return res.status(200).send(newTrial);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  );

  // admin funcitons
  app.delete(
    '/allTrials',
    verifySession,
    (req, res) => {
      Trial.deleteMany({}, (err, del) => {
        res.send(del);
      });
    }
  )

  app.get(
    '/allTrials',
    verifySession,
    (req, res) => {
      Trial.find({}, (err, trials) => {
        res.send(trials);
      })
    }
  )

  app.get('/allCurrentCarts', verifySession, (req, res) => {
    Cart.find({}, (err, carts) => {
      res.send(carts);
    })
  })
}