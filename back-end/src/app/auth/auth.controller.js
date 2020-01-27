// get token config secret
const config = require('../../config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let User = mongoose.model('User');

const transporterMail = require('../mailer');
// var config = require('../config');

// for JWT creation
const secret = config.token_secret;

exports.register_new_user = function (req, res) {
  let errors = {};
  let pwdError = {
    minLength: false,
    maxLength: false,
    content: false
  };
  let usName = {
    exists: false
  };
  if (req.body.password.length < 6) {
    pwdError.minLength = true;
    errors.minLength = 'Password must be at least 6 cahracters long.';
  }
  if (req.body.password.length > 20) {
    pwdError.maxLength = true;
    errors.maxLength = 'Password may not exceed 20 characters.'
  }
  if (!check_pwd(req.body.password)) {
    pwdError.content = true;
    errors.unequal = 'Submitted passwords are unequal'
  }

  check_username(req.body.username, req.body.email).then((message) => {
    usName.exists = message;
    errors.username = 'Username already taken.'

    if (pwdError.content || pwdError.maxLength || pwdError.minLength || usName.exists) {
      return res.status(400).send(errors);
    }
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      // for email confirmation
      confirmed: true
    });
    user.save(function (err, task) {
      if (err) {
        return res.status(500).send(err);
      }
      var token = jwt.sign({ id: task._id }, secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      transporterMail.sendMail({
        from: '"noreply" <noreply@somemail.com>',
        to: req.body.email,
        subject: 'Confirmation mail Api_Store',
        html: `<p>Hello ${req.body.username}, <br> 
                Please confirm that this email is yours. Klick following Link:
                <br></p>
                <a href="${config.api_URL}/confirm/${token}">Confirm</a>`
      })
        .catch((err) => { })
        .then(() => {
          return res.status(200).send({ created: true, token: token });
        })
    });
  })
}

check_pwd = function (password) {
  var pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  return pwdRegex.test(password);
};

check_username = function (username, email) {
  let result = new Promise((resolve, reject) => {
    User.findOne({ $or: [{ username: username }, { email: email }] }, function (err, task) {
      if (task != null) {
        resolve(true);
      }
      resolve(false);
    });
  });
  return result;
}

exports.confirm_email = function (req, res) {
  var token = req.params.token;
  if (!token) { return res.status(400).send('No verification provided.'); }
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return res.status(500).send(err);
    }
    User.findOne({ _id: decoded.id }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found, but good token?.');
      if (user.confirmed) return res.status(403).send('Already confirmed!');
      user.confirmed = true;
      user.save()
        .catch((err) => { return res.status(500).send(err) })
        .then((user) => {
          return res.redirect(config.redirect_URL);
        })
    });

  });
}

