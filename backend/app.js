require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/errors/not-found-err');
const accessCors = require('./middlewares/cors');
const routesIndex = require('./routes/index');
const { port, db } = require('./utils/env');

const { PORT = port, MONGODB_URL = db } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);

app.use(requestLogger); // подключаем логгер запросов
app.use(accessCors); // подключаем CORS

// TODO: Удалить после успешного ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// TODO: Подумать об использовании helmet и лимитера запросов
// https://expressjs.com/ru/advanced/best-practice-security.html
// https://www.npmjs.com/package/express-rate-limit

app.use('/', routesIndex);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('app: неизвестный URL'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
