const express = require('express');
const app = express();
const mongoose = require('mongoose');

Opportunity = require("./models/opportunity");

mongoose.connect('mongodb://localhost/opportunity');
const db = mongoose.connection;

app.post('/api/opportunity')

app.listen(4000);
console.log("App listening on port 4000");





