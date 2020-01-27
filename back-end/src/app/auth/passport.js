const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;;
const mongoose = require('mongoose');
const config = require('../../config');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// middleware for local strategy
passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
  async function (username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      if (!user.confirmed) { return done(null, false, { message: 'User is not confirmed.' }) };
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) { return done(null, false, { message: 'Invalid User or password?' }) }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))