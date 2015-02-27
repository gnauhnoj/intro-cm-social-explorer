'use strict';

/*
 * MiddleWare for the entire app
*/

var logError = function (err, req, res, next) {
  if (err) {
    console.error('Log Error:', err);
    return next(err);
  }
  next();
};

var handleError = function (err, req, res, next) {
  if (err) {
    res.send(err.message || err, err.status || 500);
  }
  // next();
};

var cleanEmail = function (req, res, next) {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase().trim();
    return next();
  }
  return next();
};

var cors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type, Authorization');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    return next();
  }
};

module.exports = exports = {
  logError: logError,
  cleanEmail: cleanEmail,
  handleError: handleError,
  cors: cors
};
