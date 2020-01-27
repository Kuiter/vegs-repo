const mongoose = require('mongoose');
const Label = mongoose.model('Label');

var verifySession = require('../../auth/verifytoken.middleware');

const multer = require('multer');
var crypto = require('crypto');
var path = require('path');
var storage = multer.diskStorage({
  destination: __dirname + '/./../../../assets/images/',
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err);
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});
const fs = require('fs');
const upload = multer({ storage: storage });
const utils = require('../../shared/utils');

module.exports = function (app) {
  app.post('/label/data', verifySession, (req, res) => {
    let label = new Label({
      header: req.body.header,
      description: req.body.description,
      owner: req.user.username,
      img: {

      }
    });
    label.save()
      .catch(val => { return res.send(val) })
      .then(val => { return res.send(val) })
  });

  // post new Image to label Overwrites old image?
  app.post('/label/image', verifySession, upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.send({
        success: false,
        msg: 'No file received'
      });
    }
    if (!req.body.labelID) { return res.send({ success: false, msg: 'No label ID provided' }) }
    const fullPath = path.dirname(require.main.filename) + '/assets/images/' + req.file.filename;
    Label.findById(req.body.labelID, (err, label) => {
      if (err) {
        utils.deleteFiles([fullPath])
          .then(() => {
            return res.status(500).send(err);
          })
          .catch((err) => {
            return res.send({ success: false, msg: 'Admin needed!' })
          })
      }
      if (!label) {
        return res.send({ success: false, msg: 'No Label present with id: ' + req.body.labelID })
      }
      // check if img is generated
      new Promise((resolve, reject) => {
        fs.access(fullPath, fs.F_OK, (err) => {
          if (err) {
            return err;
          }
          resolve();
          // file exists
        });
      })
        .catch((err) => { return res.status(500).send(err) })
        .then(() => {
          label.img = {
            imageID: req.file.filename,
            data: fs.readFileSync(fullPath),
            contentType: req.file.mimetype
          }
          label.save()
            .then(val => {
              utils.deleteFiles([fullPath])
                .catch((err) => { return res.status(500).send(err) })
                .then(() => {
                  return res.send(val);
                })
            })
            .catch(val => { return res.send(val) })
        })
    });
  });

  // get individual label
  app.get('/label/:id', (req, res) => {
    Label.findById(req.params.id, (err, label) => {
      if (err) { return res.status(500).send(err) }
      res.send(label);
    })
  });

  // get (post) by array
  app.post(
    '/array/label',
    verifySession,
    (req, res) => {
      Label.find({ '_id': req.body.label }, (err, label) => {
        if (err) { return res.status(500).send(err) }
        res.send(label);
      });
    }
  );

  app.get('/image/label/:id', (req, res) => {
    Label.findById(req.params.id, (err, label) => {
      if (err) { return res.status(500).send(err) }
      res.send(label.img.data);
    })
  })

  app.get(
    '/my/label',
    verifySession,
    (req, res) => {
      Label.find({ owner: req.user.username }, (err, label) => {
        if (err) { return res.status(500).send(err) }
        res.send(label);
      });
    }
  )

  // test? 
  app.get('/allLabels', (req, res) => {
    Label.find({}, (err, labels) => {
      if (err) { return res.status(500).send(err) }
      res.send(labels);
    });
  });

  app.delete('/label/:id', verifySession, (req, res) => {
    Label.findByIdAndRemove(req.params.id, (err, del) => {
      if (err) { return res.status(500).send(err) }
      res.send(del);
    });
  });
}