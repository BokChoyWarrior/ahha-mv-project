const express = require('express');
const router = express.Router();

const itemsRouter = require('./items');
const categoriesRouter = require('./categories');
const cartItemsRouter = require('./cartItems');
const cartRouter = require('./cart');

router.use('/items', itemsRouter);
router.use('/categories', categoriesRouter);
router.use('/cartItems', cartItemsRouter);
router.use('/cart', cartRouter);

module.exports = router;
