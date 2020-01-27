const mongoose = require('mongoose');
const Item = mongoose.model('Item');
const Image = mongoose.model('Image');
const User = mongoose.model('User')
// for verifying access rights
var verifySession = require('../auth/verifytoken.middleware');

// for image upload post
const multer = require('multer');
var crypto = require('crypto');
var path = require('path');
var storage = multer.diskStorage({
  destination: __dirname + '/./../../assets/images/',
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err);
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});
const fs = require('fs');

const upload = multer({ storage: storage });

const utils = require('../shared/utils');


module.exports = function (app) {
  let item = require('./item.controller');
  // specific items
  app.use('/item', verifySession);
  app.route('/item')
    .post(item.save_new_item_data)
    .put(item.update_specific_item)

  app.post(
    '/get/array/items',
    verifySession,
    (req, res) => {
      Item.find(req.body.items, (err, items) => {
        if (err) { return res.status(500).send(err) }
        res.send(items);
      });
    }
  );
  app.post('/array/items', verifySession, (req, res) => {
    let result = [];
    let p = new Promise((resolve, reject) => {
      req.body.items.forEach((element, index) => {
        element.owner = req.user.username;
        let item = new Item(element);
        item.save().then((val) => {
          result.push(val);
          User.findByIdAndUpdate(req.user._id, { $push: { items: item._id } }, (err, added) => {
            if (err) { return res.status(500).send(err) }
            if (index == req.body.items.length - 1) {
              resolve();
            }
            // res.send(item);
          });
        });
      });
    });
    p.then(() => {
      res.send(result);
    });
  });

  // image upload post
  app.post('/add/image', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.send({
        success: false
      });
    }
    // constants
    const fullPath = path.dirname(require.main.filename) + '/assets/images/' + req.file.filename;
    const Resize = require('./Resize');
    let thumbnailCreate = new Resize(fullPath);
    thumbnailCreate.generateThumbnail()
      .catch((msg) => {
        return res.status(500).send(msg);
      })
      .then(($path) => {
        originalImg = new Image({
          img: {
            imageID: req.file.filename,
            data: fs.readFileSync(fullPath),
            contentType: req.file.mimetype
          }
        });
        thumbnailImg = new Image({
          img: {
            imageID: path.basename($path),
            data: fs.readFileSync($path),
            contentType: req.file.mimetype
          }
        });
        let p1 = originalImg.save();
        let p2 = thumbnailImg.save();
        Promise.all([p1, p2])
          .catch(values => {
            return res.status(500).send(values);
          })
          .then((images) => {
            utils.deleteFiles([fullPath, $path])
              .then(async () => {
                let item = await Item.findOne({ _id: req.body.itemID });
                if (!item) { return res.status(500).send(err) }
                if (!item.image) { item.image = {} }
                item.image.th = images[1]._id;
                item.image.full = images[0]._id;
                await item.save()
                return res.send({msg: 'Image saved!', images})
              })
          })
      })
  });

  app.get('/images/:id', (req, res) => {
    Image.findOne({ _id: req.params.id }, (err, img) => {
      if (err) { return res.status(500).send(err) }
      if (!img) { return res.status(404).send({ msg: 'Image not found.' }) }
      res.send(img.img.data);
    })
  });

  app.get('/my/items', verifySession, (req, res) => {
    Item.find({ owner: req.user.username }, (err, items) => {
      if (err) { return res.status(500).send(err) }
      let onlyBaseItems = items.filter(it => it.oldID == '');
      res.send(onlyBaseItems)
    });
  });

  app.route('/item/:id')
    .get(item.get_specific_item)
    .delete(item.delete_one_item)

  // query items based on filter
  app.route('/query')
    .get(item.query_items)

  app.route('/allItems')
    .get(item.get_all_items)

  // admin function
  app.route('/deleteAllItems')
    .delete(item.delete_all_items)


  app.get('/all/images', (req, res) => {
    Image.find({}, (err, images) => {
      if (err) { return res.status(500).send(err) }
      if (!images) {
        return res.send('no images found?');
      }
      res.send(images)
    })
  })
  // test delete all images should also delete all references in items?
  /*
  TODO: delete all references in items?
  */
  app.get('/all/images', (req, res) => {
    Image.find({}, (err, images) => {
      res.send(images);
    })
  })
  app.delete('/all/images', (req, res) => {
    Image.deleteMany({}, (err, deleted) => {
      if (err) { return res.status(500).send(err); }
      res.send(deleted);
    })
  });
  // for changing owner? 
  app.post('/set/owner', (req, res) => {
    Item.findById(req.body.itemID, (err, item) => {
      if (err) { return res.status(500).send(err) }
      if (!item) { return res.send('No item forund') }
      // check if owner exists?
      User.find({ 'username': { $in: req.body.ownerName } }, (err, user) => {
        if (err) { return res.status(500).send(err) }
        if (!user) { return res.send('No user found') }
        item.owner = req.body.ownerName;
        item.save().then((val) => { res.send(val) })
      })
    });
  });
}
