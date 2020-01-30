const mongoose = require('mongoose');
const Treatment = mongoose.model('Treatment');
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Tree = mongoose.model('Tree');

exports.get_all_my_treatments = async function (req, res) {
  const qr = Treatment.find({ owner: req.user.username }).select('-items');
  try {
    const treatments = await qr.exec();
    res.status(200).send(treatments)
  } catch (error) {
    return res.status(500).send(err);
  }
}

exports.put_new_items_to_treatment = function (req, res) {
  Treatment.findById(req.params.id, (err, tr) => {
    if (err) { return res.status(500).send(err) }
    // get all items that are not yet added and generate and save
    let promises = [];
    if (tr.items.length > 0) {
      if (req.body.items.length > 0) {
        let newItems = req.body.items.filter((el) => {
          if (tr.items.findIndex(t => t.oldID == el._id) == -1) {
            return el;
          }
        });
        if (newItems.length == 0) {
          return res.send({ success: true, msg: 'no new items added' });
        }
        newItems.forEach(element => {
          promises.push(new Promise((resolve, reject) => {
            Item.findById(element, (err, item) => {
              let newItem = item.toObject()
              newItem.oldID = item._id;
              delete newItem._id;
              delete newItem.createdAt
              delete newItem.updatedAt
              delete newItem.__v
              let it = new Item(newItem);
              it.save()
                .then((val) => {
                  tr.items.push(val);
                  resolve();
                })
                .catch((err) => { reject(err); });
            })
          }));
        });
      } else {
        return res.send({ success: false, msg: 'No Items send.' });
      }
    } else {
      // add items cause no items present
      req.body.items.forEach((i) => {
        promises.push(new Promise((resolve, reject) => {
          Item.findById(i, (err, item) => {
            if (err) { return res.status(500).send(err) }
            let newItem = item.toObject()
            newItem.oldID = item._id;
            delete newItem._id;
            delete newItem.createdAt
            delete newItem.updatedAt
            delete newItem.__v
            let it = new Item(newItem);
            it.save()
              .then((val) => {
                tr.items.push(val);
                resolve();
              })
              .catch((err) => { reject(err) });
          });
        }));
      });
    }
    Promise.all(promises).then(() => {
      tr.save()
        .then((val) => {
          res.send(val);
        })
        .catch((err) => { return res.status(500).send(err) })
    });
  });
}

exports.put_new_filters_to_treatment = function (req, res) {
  Treatment.findById(req.params.id, (err, tr) => {
    if (err) { return res.status(500).send(err) }
    // check if tree already there
    const treeID = req.body.filter;
    let promise;
    if (tr.filters.length != 0) {
      if (tr.filters.findIndex(f => f.oldID == treeID) != -1) {
        return res.send({ success: true, msg: 'Filter already added.' })
      }
    }
    Tree.findById(treeID, (err, tree) => {
      if (err) { return res.status(500).send(err) }
      let newTree = tree.toObject();
      newTree.oldID = newTree._id;
      delete newTree._id;
      delete newTree.__v;
      let t = new Tree(newTree);
      promise = new Promise((resolve, reject) => {
        t.save().then(
          (val) => {
            tr.filters.push(val);
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
      });
      promise
        .then(() => {
          tr.save().then((val) => {
            res.send(val);
          });
        })
        .catch((err) => {
          return res.status(500).send(err);
        })
    });
  });
}

exports.post_new_treatment = function (req, res) {
  let treatment = {};
  Object.assign(treatment, req.body);
  treatment.owner = req.user.username;
  let trDocument = new Treatment(treatment);
  trDocument.save((err, tr) => {
    if (err) { return res.status(500).send(err) }
    if (!tr) { return res.send('Could not create treatment?') }
    res.send(tr);
  });
}

exports.delete_specific_treatment = function (req, res) {
  /**
   * for deletion first delete all items, 
   * delete all filters 
   * and then delete treatment
   *  */
  // let itemsToDelete = [];
  // let filtersToDelete = [];
  let resp = {
    deletions: []
  };
  let promisesArray = []
  Treatment.findById(req.params.id, (err, treatment) => {
    if (err) { return res.status(500).send(err) }
    if (!treatment) { return res.status(404).send({ success: false, msg: 'No treatment found. Deletion canceled.' }) }
    if (treatment.items.length == 0) { } else {
      treatment.items.forEach(el => {
        promisesArray.push(
          new Promise((resolve, reject) => {
            Item.findByIdAndDelete(el._id, (err, del) => {
              if (err) { reject(err) }
              resolve(del)
            })
          })
        )
      });
    }
    if (treatment.filters.length == 0) { } else {
      treatment.filters.forEach(el => {
        promisesArray.push(
          new Promise((resolve, reject) => {
            Tree.findByIdAndDelete(el._id, (err, del) => {
              if (err) { reject(err) }
              resolve(del)
            })
          })
        )
      });
    }
    Promise.all(promisesArray)
      .then((val) => {
        val.forEach(el => { resp.deletions.push(el) });
        Treatment.findByIdAndDelete(req.params.id, (err, del) => {
          if (err) { return res.status(500).send(err) }
          resp.success = true;
          resp.deletions.push(del);
          resp.msg = 'Sucessfully deleted Treatment, Items, and Filters';
          res.send(resp);
        })
      })
      .catch((val) => {
        return res.status(500).send(val);
      })
  });
}

exports.delete_item_from_treatment = function (req, res) {
  removeItemFromTreatment(req.params.treatmentID, req.params.itemID)
    .then((val) => {
      // sends new treatment
      res.send(val);
    })
    .catch((val) => {
      res.send(val);
    })
}

function removeItemFromTreatment(treatmentID, itemID) {
  return new Promise((resolve, reject) => {
    Treatment.findById(treatmentID, (err, treatment) => {
      if (err) { resolve(err) }
      const id = treatment.items.findIndex(x => x._id == itemID);
      Item.findByIdAndDelete(itemID, (err, del) => {
        treatment.items.splice(id, 1);
        treatment.save().then((val) => {
          resolve(val);
        })
      });
    })
  })
}