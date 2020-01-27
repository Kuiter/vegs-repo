// pull config from configuration  files
const config = require('./config'); // sets environment variables
let securityConfig = require('./security.config'); // sets DB

const express = require('express');
var mongoose = require('mongoose');
// var LabelModel = require('./app/options/label/label.model');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
// for app start listen
const PORT = config.port;

var cors = require('cors')
let app = express();

// App should use logger to log all incoming http requests 
const logger = require('morgan');
app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));

// use specific bodyparser
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }, { useNewUrlParser: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));

// for image serving url .../public/img-path...
app.use(express.static('./src/assets'));

// security configurations
securityConfig.useHelmet(app);

// configure cors before! routes
app.use(cors());
// use routes for Applicaiton
require('./app/user/user.model');

// passport service
require('./app/auth/passport');

// session configuration
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // one month
    keys: [config.token_secret]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./app/item/image.model');
require('./app/item/item.model');
require('./app/subject/subject.model');
require('./app/options/options.module')(app);
require('./app/subject/subject.model');
require('./app/treatment/treatment.model');
require('./app/trial/trial.model');

let authRoute = require('./app/auth/auth.route');
authRoute(app);
let userRoute = require('./app/user/user.route'); // import declared routes
userRoute(app); // register Route
let itemRoute = require('./app/item/item.route');
itemRoute(app);
// modules
require('./app/treatment/treatment.route')(app);
require('./app/subject/subject.route')(app);
require('./app/trial/trial.route')(app);

const db = config.db.host;
const dbName = config.db.name;
mongoose.Promise = global.Promise;
// for deprecation warning
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${db}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => { console.info(`Server is running on Port: ${PORT}`) });
