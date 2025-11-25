const express = require('express');
const cors = require('cors');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/error.middleware');
const { currentUser } = require('./middlewares/currentUser.middleware');
const router = require('./routes');

const app = express();
const suppliersRoutes = require('./routes/suppliers');
const dashboardRoutes = require('./routes/dashboard');

app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-User-Id', 'Authorization'],
    credentials: false,
  })
);
app.options('*', cors());

app.use(currentUser);

app.get('/', (_req, res) =>
  res.json({ ok: true, service: 'api-fullstack-sqlite', version: '1.0.0' })
);

app.use('/auth', router.auth);

app.use('/addresses/me', router.addressesMe);
app.use('/orders/me', router.ordersMe);
app.use('/cart', router.cartMe);

app.use('/brands', router.brands);
app.use('/categories', router.categories);
app.use('/products', router.productsV2);
app.use('/users', router.users);
app.use('/customers', router.customers);
app.use('/addresses', router.addresses);
app.use('/orders', router.orders);
app.use('/api/suppliers', router.suppliers);
app.use('/api/admin', router.dashboard);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
