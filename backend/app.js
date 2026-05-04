require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { API_PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();

const { PORT = API_PORT } = process.env;

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(requestLogger);

/* =========================
   CORS CONFIG (FIX)
========================= */

const allowedOrigins = [
  'https://lufaa657.github.io',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.options('*', cors());

/* =========================
   TEST ROUTE
========================= */

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

/* =========================
   AUTH ROUTES
========================= */

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

/* =========================
   PROTECTED ROUTES
========================= */

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

/* =========================
   404
========================= */

app.use('*', (req, res) => {
  res.status(404).send({ message: 'The request was not found' });
});

/* =========================
   ERROR HANDLERS
========================= */

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

/* =========================
   START SERVER
========================= */

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;