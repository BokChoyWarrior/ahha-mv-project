const express = require('express');
const router = express.Router();

const itemsRouter = require('./items');
const categoriesRouter = require('./categories');
const cartItemsRouter = require('./cartItems');
const cartsRouter = require('./carts');

router.use('/items', itemsRouter);
router.use('/categories', categoriesRouter);
router.use('/cartItems', cartItemsRouter);
router.use('/carts', cartsRouter);

module.exports = router;
