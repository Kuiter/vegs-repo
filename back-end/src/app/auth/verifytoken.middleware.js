function verifySession (req, res, next) {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  next();
}

module.exports = verifySession;