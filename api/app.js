const express = require('express');

const app = express();
app.get('/', (req, res, next) => res.send('Hello from Node.js authentication server'));

module.exports = app;
