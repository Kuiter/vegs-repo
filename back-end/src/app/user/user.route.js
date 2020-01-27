var verifySession =require('../auth/verifytoken.middleware');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function (app, acl) {
  let user = require('./user.controller');

  // user CRUD
  app.route('/user')
    .put(verifySession, user.modify_user_email)
    .get(verifySession, user.get_single_user);
  
    app.use('/user_delete', verifySession);
  app.route('/user_delete')
    .delete(user.delete_all_users, verifySession);

  app.use('/allUsers', verifySession);
  app.route('/allUsers')
    .get(user.get_all_user, verifySession);

  app.delete(
    '/user/:userID',
    (req, res) => {
      User.findByIdAndDelete(req.params.userID, (err, del) => {
        return res.send(del);
      })
    }
  )
}