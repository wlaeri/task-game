var sessionSecret = require('../../../sessionSecret.js')

module.exports = {
  "DATABASE_URI": "postgres://localhost:5432/taskGame",
  "SESSION_SECRET": sessionSecret.secret,
  "LOGGING": true
};
