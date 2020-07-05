
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const employees = require('./apis/employees');
const login = require('./apis/login');
const register = require('./apis/register');
const error = require('./middlewares/error');
const auth = require('./middlewares/auth');
const config = require('./config');
require('express-async-errors');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use('/api/employees',auth, employees);
app.use('/api/register',auth, register);
app.use('/api/login', login);
app.use(error);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`server started at ${port}`);
})

mongoose.connect(config.mongodbURL,  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false } )
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => console.log("couldn't connect to db", err)) 