const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const { createCounter } = require("./controllers/counterController");
const { createUrl, redirectUrl } = require("./controllers/urlController");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require('./utils/AppError');

const { PORT, MONGO_DB_URL, MONGO_DB_NAME } = process.env;

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.use(bodyParser.json());
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(rateLimiter);


app.get('/hello', (req, res) => res.send("HELLO WORLD"));
app.post('/counters', createCounter);
app.post('/surl', createUrl);
app.get('/surl/:hash', redirectUrl);

app.all("*", (req, res, next) => next(new AppError("Route Not Found", 404)));

app.use(globalErrorHandler);

app.listen(PORT, async () => {
    await mongoose.connect(MONGO_DB_URL, { dbName: MONGO_DB_NAME })
    console.log(`Server Listening on Port ${PORT}`)
})