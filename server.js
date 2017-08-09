'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.js');
require('dotenv').config();

var app = express();

mongoose.connect(process.env.DB_URL);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(authRouter);

app.listen(process.env.PORT||8080,function(){
    console.log(`Express app listening on port ${process.env.PORT||8080}`);
});
