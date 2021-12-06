require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const tasksRoute = require('./routes/tasksRoute');
const accountRoute = require('./routes/accountRoute');
const tokenMiddleware= require('./middlewares/tokenMiddleware');

const API_PORT = process.env.API_PORT || process.env.PORT || 80;
const API_HOST = process.env.API_HOST || '0.0.0.0';

const MONGO_URI = process.env.MONGO_URI;

const app = express();

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
    console.log('Mongo DB Connection Status : SUCCESS!');
});

mongoose.connection.on('error', (error) => {
    console.log('Mongo DB Connection Status : ERROR!');
    console.log(error);
    console.log('******')
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/tasks',tokenMiddleware,tasksRoute);
app.use('/api/account',accountRoute);

app.get("/hi", (req, res) => {
    res.send("hi api working!!");
});

app.listen(API_PORT, API_HOST, () => {
    console.log(`Listening: ${API_HOST}/${API_PORT}.`);
});