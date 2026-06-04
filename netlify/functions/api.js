const serverless = require('serverless-http');
const express = require('express');
const originalApp = require('../../server.js');

const app = express();

// Middleware to normalize paths for serverless execution
app.use((req, res, next) => {
  // If the path doesn't start with /api, prepend it so Express routes match
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

app.use(originalApp);

module.exports.handler = serverless(app);
