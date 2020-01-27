// dotenv for local and secret configuratoins... 
const dotenv = require('dotenv').config({path: __dirname + '/./../.env'});
const convict = require('convict');

const config = convict({
  env: {
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The ip adress to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  db: {
    host: {
      doc: "Database host name/IP",
      format: '*',
      default: '127.0.0.1:27017',
      env: 'DB_HOST',
      arg: 'db_host'
    },
    name: {
      doc: "Database name",
      format: String,
      default: 'data',
      env: 'DB_NAME',
      arg: 'db_name'
    }
  },
  token_secret: {
    doc: 'Configure secret key for json token generation',
    format: String,
    default: 'default',
    env: 'TOKEN_SECRET',
    arg: 'token_secret'
  },
  origin: {
    doc: 'Specify request origin for allowing cors',
    format: String,
    default: 'http://localhost:4200',
    arg: 'cors_origin',
    env: 'CORS_ORIGIN'
  },
  redirect_URL: {
    doc: 'Specify redirect URL after account confirmation',
    format: String,
    default: 'http://127.0.0.1:4200/auth/signin',
    env: 'REDIRECT_URL',
    arg: 'redirect_URL'
  },
  api_URL: {
    doc: 'Specify full API URL',
    format: String,
    default: 'http://127.0.0.1:3000',
    env: 'API_URL',
    arg: 'api_URL'
  }
});

const env = config.get('env');
console.log(config.get('env'));
config.loadFile(`${__dirname}/config/${env}.json`);
config.validate({ allowed: 'strict' }); // throws error if config does not conform to schema

// so we can operate with a plain old JavaScript object and abstract away convict (optional)
module.exports = config.getProperties();