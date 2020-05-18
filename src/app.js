const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')

const app = express();
const router = express.Router();

mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const User = require('./models/user-model');
const Article = require('./models/article-model');

const indexRoutes = require('./routes/index-route');
const userRoute = require('./routes/user-route');
const articleRoute = require('./routes/article-route');
const authenticateRoute = require('./routes/authenticate-route');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRoutes);
app.use('/users', userRoute);
app.use('/articles', articleRoute);
app.use('/authentication', authenticateRoute);

module.exports = app;