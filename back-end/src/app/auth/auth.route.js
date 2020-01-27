var auth = require('./auth.controller'); //(acl)
var verifySession = require('./verifytoken.middleware');
const passport = require('passport');

module.exports = function (app, acl) {
  app.route('/register')
    .post(auth.register_new_user);

  app.post('/login', passport.authenticate('local'), (req, res) => {
    return res.send(req.user);
  })
  
  app.get(
    '/confirm/:token',
    auth.confirm_email
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send({ msg: 'Logged out user' })
  });

  app.get('/check', verifySession, (req, res) => {
    res.send({ auth: true, msg: 'You are logged in.' })
  })
}