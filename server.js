'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const path = require('path');
const authRouter = require('./routes/auth.js');

var app = express();

mongoose.connect(config.db);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(authRouter);

app.listen(3001);
console.log('Express app listening on port 3001');
