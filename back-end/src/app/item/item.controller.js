const mongoose = require('mongoose');
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Image = mongoose.model('Image');
const Treatment = mongoose.model('Treatment');
const url = require('url');

Image.collection.stats(function(err, result) {
  console.log(result.storageSize)
})

exports.get_specific_item = function (req, res) {
  // :id should be ObjectId of item document in db
  Item.findById(req.params.id, function (err, task) {
    if (err) { return res.status(404).send(err); }
    res.status(200).send(task);
  });
}

exports.query_items = function (req, res) {
  // extracts all query params as object {key: value, ...}
  const queryParams = url.parse(req.url, true).query;
}

// Save new item 
// Split in two steps, because images need to be parsed, renamed, moved and 
// thumbnail needs to be created. After this the resulting filepath needs 
// to be saved to the item 
exports.save_new_item_data = function (req, res) {
  if (req.body._id != undefined) {
    delete req.body._id;
  }
  let item = new Item(req.body);
  item.owner = req.user.username;
  item.save((err, item) => {
    if (err) { return res.status(500).send(err) }
    // write new itemID to items array for user; access control
    res.send(item);
  });
}

// Update specific item
exports.update_specific_item = function (req, res) {
  // test if ID is provided
  if (req.body._id == undefined) {
    return res.send('No ItemID provided');
  }
  Item.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, item) => {
    // if any error acucred
    if (err) { return res.status(500).send(err) }
    // if no item was found with id x
    if (!item) {
      return res.send('No item found with itemID: ' + req.body._id);
    }
    item.save().then((n) => {
      res.send(n);
    });
  });
}

// Delete
exports.delete_one_item = function (req, res) {
  Item.findById(req.params.id, function (err, item) {
    if (!item) {
      return res.send({ sucess: false, msg: 'No item found!' })
    }
    deleteItem(req.user._id, item)
      .then((val) => {
        res.send(
          {
            success: true,
            msg: 'deleted user ref, image, and item itself.',
            deletion: val
          }
        );
      })
      .catch((val) => {
        res.send(val);
      })
  })
}

/*
* delete all items and images    
*/
exports.delete_all_items = function (req, res) {
  Item.find({}, (err, items) => {
    if (err) { return res.status(500).send(err) }
    let resp = {
      deletion: []
    };
    items.forEach((element, index) => {
      getUserID(element.owner)
        .then((userID) => {
          deleteItem(userID, element)
            .then((val) => {
              resp.deletion.push(val);
              if (index == items.length - 1) {
                resp.success = true;
                resp.msg = 'deleted user ref, image, and item itself.';
                res.send(resp);
              }
            })
            .catch((val) => {
              return res.send(val);
            })
        })
        .catch(() => {
          return res.send({ success: false, msg: 'Get userID failed.' })
        });
    });
  });
}

exports.get_all_items = function (req, res) {
  Item.find({}, function (err, task) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(task);
  });
}

function imageDelete(ref) {
  return new Promise((resolve, reject) => {
    Image.deleteOne({ 'img.imageID': { $in: ref } })
      .then(() => {
        resolve();
      })
      .catch(() => { reject({ sucess: false, msg: 'Image delete failed!' }) })
  })
}

function deleteItem(userID, item) {
  // delete Images // delete ref in User
  return new Promise((resolve, reject) => {
    let promiseArray = [];
    if (item.oldID == '') {
      // with new owner ship not needed any more.. 
      // promiseArray.push(deleteItemRefUser(userID, item._id));
      if (item.images.length > 0) {
        item.images.forEach((element) => {
          promiseArray.push(
            imageDelete(element)
          );
          promiseArray.push('th_' + element);
        });
      }
      promiseArray.push(new Promise((resolve, reject) => {
        Treatment.findOne({ items: { $elemMatch: { '_id': item._id } } }, (err, tr) => {
          if (err) { reject(err) }
          if (!tr) { resolve() }
          deleteItemInTreatment(item).then(() => {
            resolve();
          })
        })
      }));
      Promise.all(promiseArray)
        .then(() => {
          Item.deleteOne({ _id: item._id }).then((val) => {
            resolve(val);
          })
        })
        .catch((val) => {
          reject(val);
        });
    } else {
      deleteItemInTreatment(item)
        .then(() => {
          Item.deleteOne({ _id: item._id }).then((val) => {
            resolve(val);
          })
        })
        .catch((val) => {
          reject(val);
        })
    }
  });
}

function deleteItemInTreatment(item) {
  return new Promise((resolve, reject) => {
    Treatment.find({ items: { $elemMatch: { 'oldID': item._id } } }, (err, treatment) => {
      if (err) {
        reject(err);
        return;
      }
      if (!treatment) {
        resolve()
        return;
      }
      promiseArray = [];
      treatment.forEach((element) => {
        const ind = element.items.findIndex(x => x.oldID == item._id);
        element.items.splice(ind, 1);
        promiseArray.push(
          element.save()
        )
      });
      Promise.all(promiseArray).then(() => {
        resolve()
      })
    })
  });
}

function getUserID(username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { reject(err) }
      resolve(user._id);
    });
  });
}