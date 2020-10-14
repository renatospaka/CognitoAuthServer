const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./Routes/routes');
app.use(routes);

//app.get('/', (req, res, next) => res.send('Hello from Node.js authentication server'));

module.exports = app;
