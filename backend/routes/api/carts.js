const express = require('express');
const router = express.Router();
const { Cart, CartItem, Item } = require('../../database/models');

router.get('/', async (req, res) => {
  try {
    const carts = await Cart.findAll({});

    res.status(200).send(carts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create(req.body);

    res.status(200).send(cart);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { id: req.params.id } });

    if (cart) {
      await cart.destroy();
      res.status(200).send(cart);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { id: req.params.id } });

    if (cart) {
      await cart.update(req.body);
      res.status(200).send(cart);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id/cartItems', async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id, {
      include: Item,
    });
    if (cart) {
      res.status(200).send(cart.Items);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

async function removeItemFromCart(item) {
  return await item.CartItem.destroy();
}

/**
 * This route will attempt to add or remove an amount (specified in req.body) to a user's given cart item.
 *
 * If the resulting quantity is 0 or negative, the item will simply be removed from the cart.
 *
 * Resulting quantity is always returned, clamped to 0 and above.
 *
 *
 */
router.post('/:cartId/cartItems', async (req, res) => {
  const { itemId, amountToAdd } = req.body;

  const cart = await Cart.findByPk(req.params.cartId, { include: { model: Item } });

  if (!cart) {
    res.status(404).end();
    return;
  }
  const items = await cart.getItems({ where: { id: itemId } });

  let item = false;
  let quantity = 1;
  // If the item already exists
  if (items.length > 0) {
    item = items[0];
  }
  if (item) {
    quantity = item.CartItem.quantity + amountToAdd;
    if (quantity < 1) {
      await removeItemFromCart(item);
    }
  } else {
    item = await Item.findByPk(itemId);
  }

  if (quantity > 0) {
    await cart.addItem(item, { through: { quantity: quantity } });
  } else {
  }

  res.status(200).json(quantity);
});

module.exports = router;
