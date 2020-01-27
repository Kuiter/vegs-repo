var helmet = require('helmet');

exports.useHelmet = function (app) {
  // use helmet for security configuration on HTTP headers
  app.use(helmet());
}

