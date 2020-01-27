const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.delete_single_user = function (req, res) {
  User.findOneAndRemove(req.user._id, function (err, deleted) {
    if (err) { res.status(500).send(err) }
    res.send(deleted);
  });
};

exports.get_single_user = function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) { res.status(500).send(err) }
    let result = {
      username: user.username,
      email: user.email
    }
    res.send(result);
  })
};

exports.get_all_user = function (req, res) {
  User.find({}, function (err, task) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(task);
  });
};

exports.modify_user_email = function (req, res) {
  User.findByIdAndUpdate(
    req.body.username,
    {
      email: req.body.email,
      // modified: new Date()
    },
    { new: true },
    (err, todo) => {
      if (err) { return res.status(500).send(err); }
      return res.status(200).send(todo);
    }
  )
};

exports.delete_all_users = function (req, res) {
  User.deleteMany({ username: { $not: /Sebastian/ } }, function (err, task) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(task);
  });
}
