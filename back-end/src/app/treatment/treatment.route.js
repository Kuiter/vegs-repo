const mongoose = require('mongoose');
const Treatment = mongoose.model('Treatment');
const User = mongoose.model('User');
const Tree = mongoose.model('Tree');
const Item = mongoose.model('Item');

let verifySession = require('../auth/verifytoken.middleware');

/**
 * API endpoint definition for all treatment model related data. 
 * @param {Express.app} app
 */
module.exports = function (app) {
  let treatment = require('./treatment.controller')

  /**
   * Route for handeling creation and admin functions.
   */
  app.route('/treatment', verifySession)
    .get(verifySession, treatment.get_all_my_treatments)
    // used to update the name and description of a treatment
    .put(verifySession, (req, res) => {
      Treatment.findById(req.body._id, (err, treatment) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err)
        }
        // Object.assign(treatment, req.body);
        treatment.name = req.body.name;
        treatment.description = req.body.description;
        Object.assign(treatment, req.body);
        treatment.save()
          .catch((err) => { return res.status(500).send(err) })
          .then((val) => {
            res.status(200).send(val);
          })
      });
    })
    .post(verifySession, treatment.post_new_treatment);

  // Put new items in treatment
  /**Route for adding items to treatment. */
  app.put('/treatment/items/:id',
    verifySession,
    treatment.put_new_items_to_treatment
  );
  /**Route for deleting an item from a treatment. */
  app.delete(
    '/deleteItem/:treatmentID/:itemID',
    verifySession,
    treatment.delete_item_from_treatment
  );
  /**Route for adding item to treatment? */
  app.put(
    '/treatment/item',
    verifySession,
    (req, res) => {
      Treatment.findOne({ items: { $elemMatch: { '_id': req.body._id } } },
        (err, treatment) => {
          if (err) { return res.status(500).send(err) }
          if (!treatment) { return res.status(404).send({ msg: 'No treatmet found' }) }
          Item.findById(req.body._id, (err, item) => {
            if (err) { return res.status(500).send(err) }
            if (!item) { return res.status(404).send({ msg: 'Item not found!' }) }
            Object.assign(item, req.body);
            const ind = treatment.items.findIndex(x => {
              return x._id == (item._id).toString();
            });
            if (ind == -1) {
              return res.send({ msg: 'No item in treatment item found' });
            }
            item.save()
              .then((it) => {
                treatment.items.splice(ind, 1, it);
                treatment.save()
                  .then((tr) => {
                    res.send(tr);
                  })
                  .catch((err) => { return res.status(500).send(err) })
              })
              .catch((err) => { return res.status(500).send(err) })
          });
        }
      );
    }
  )

  app.get(
    '/check/active/:treatmentID',
    async (req, res) => {
      const { treatmentID } = req.params;
      try {
        const qr = Treatment.findById(treatmentID).select('-items')
        const tr = await qr.exec();
        tr.active ? res.status(200).send() : res.status(400).send('Treatment inactive.')
      } catch (error) {
        return res.status(404).send('no treatment found')
      }
    }
  )

  app.get(
    '/activate/tr/:treatmentID',
    verifySession,
    async (req, res) => {
      const {treatmentID} = req.params;
      const qr = Treatment.findById(treatmentID).select('-items');
      try {
        const tr = await qr.exec();
        tr.active = true;
        try {
          await tr.save();
          return res.status(200).send();
        } catch(err) {
          console.error('err1', err)
          return res.status(500).send(err)  
        }
      } catch (err) {
        console.log('err2', err);
        return res.status(500).send(err)
      }
    }
  )

  app.get(
    '/deactivate/tr/:treatmentID',
    verifySession,
    async (req, res) => {
      const {treatmentID} = req.params;
      const qr = Treatment.findById(treatmentID).select('-items')
      try {
        const tr = await qr.exec();
        tr.active = false;
        await tr.save();
        return res.status(200).send();
      } catch (err) {
        return res.status(500).send(err)
      }
    }
  )

  // Put new tree to treatment one by one
  /**Add custom filter to treatment. */
  app.put('/treatment/tree/:id',
    verifySession,
    treatment.put_new_filters_to_treatment
  );
  // modify tree on treatment // only for items?
  /**Route for modifying a filter tree allocated on a treatment. */
  app.put('/treatment/:treatmentID/:treeID', verifySession, (req, res) => {
    const { treatmentID } = req.params;
    const query = Treatment.findById(treatmentID).select('-items');
    query.exec((err, treatment) => {
      if (err) { return res.status(500).send(err) }
      const ind = treatment.filters.findIndex(x => x._id == req.params.treeID);
      if (ind == -1) {
        return res.send({ sucess: false, msg: 'Filter not found in Treatment' })
      }
      Object.assign(treatment.filters[ind], req.body);
      treatment.save().then((newT) => {
        res.send(newT);
      })
    })
  });
  // delete all trees of treatment
  app.delete('/tree/treatment/:id',
    verifySession,
    (req, res) => {
      const { id } = req.params;
      const query = Treatment.findById(id).select('-items');
      query.exec((err, tr) => {
        if (err) { return res.status(500).send(err) }
        if (!tr) { return res.send('no treatment found?') }
        let idArray = [];
        tr.filters.forEach(element => {
          idArray.push(element._id);
        });
        Tree.deleteMany({ _id: { $in: idArray } }, (err, del) => {
          if (err) { return res.status(500).send(err) }
          tr.filters = [];
          tr.save().then((val) => { res.send(val) })
        });
      });
    })
  // delete specific filter of treatment
  /**Delete custom filter from treatment. */
  app.delete(
    '/tree/:treatmentID/:treeID',
    verifySession,
    (req, res) => {
      const { treatmentID } = req.params;
      const query = Treatment.findById(treatmentID).select('-items');
      query.exec((err, tr) => {
        if (err) { return res.status(500).send(err) }
        if (!tr) { return res.send('No matching treatment found') }
        const ind = tr.filters.findIndex((x) => { return x._id == req.params.treeID });
        if (ind == -1) { return res.send('No matching filter found') }
        Tree.findOneAndDelete({ _id: tr.filters[ind]._id }, (err, tree) => {
          if (err) { return res.status(500).send(err) }
          tr.filters.splice(ind, 1);
          tr.save()
            .catch((err) => { return res.status(500).send(err) })
            .then((newTr) => {
              res.send(newTr);
            })
        });
      });
    }
  );

  /**Still used? */
  // app.get('/treatment/:id', verifySession, (req, res) => {
  //   User.findById(req.user._id, (err, user) => {
  //     if (err) { return res.status(500).send(err) }
  //     const ind = user.treatments.indexOf(req.params.id);
  //     if (ind == -1) { return res.send({ success: false, msg: 'No matching Treatment found.' }) }
  //     Treatment.findById(req.params.id, (err, treatment) => {
  //       if (err) { return res.status(500).send(err) }
  //       res.send(treatment);
  //     })
  //   })
  // });

  /**Endpoint for deleting specific treatment. */
  app.delete(
    '/treatment/:id',
    verifySession,
    treatment.delete_specific_treatment
  );

  // admin function not deleting connected Items, and filters? 
  /**Admin function for deleting all treaments .. should be deleted. */
  app.delete(
    '/all/treatment',
    verifySession,
    (req, res) => {
      Treatment.deleteMany({}, (err, deletion) => {
        if (err) { return res.status(500).send(err) }
        res.send(deletion);
      });
    }
  );

  /**
   * delete one BaseTree only if not referenced in treatment?
   * 
   */
  app.delete('/options/groups/tree/:id', verifySession, (req, res) => {
    Treatment.find({ filters: { $elemMatch: { 'oldID': req.params.id } } }, (err, treatments) => {
      if (err) { return res.status(500).send(err) }
      if (treatments.length == 0) {
        Tree.findByIdAndDelete(req.params.id, (err, del) => {
          if (err) { return res.status(500).send(err) }
          res.send(del);
        });
      } else {
        res.send({ success: false, msg: 'Filter is in use in other Treatments' })
      }
    });
  });

  /**Admin function, should also be deleted. */
  app.get(
    '/all/treatment',
    verifySession,
    (req, res) => {
      const query = Treatment.find({}).select('-items');
      query.exec((err, treatments) => {
        if (err) { return res.status(500).send(err) }
        res.send(treatments);
        // Treatment.find({}, (err, treatments) => {
        //   if (err) { return res.status(500).send(err) }
        //   res.send(treatments);
        // })
      })
    }
  );

  /**
   * Requests for starting and getting treatment specific information and items
   */
  // for getting specific treatment specifications in advance of test run
  app.get('/t/:treatmentID', (req, res) => {
    Treatment.findById(req.params.treatmentID, (err, treatment) => {
      if (err) { return res.status(500).send(err) }
      res.send(treatment);
    });
  });

}