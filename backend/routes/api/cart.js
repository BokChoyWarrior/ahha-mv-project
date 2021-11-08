const express = require('express');
const router = express.Router();
const { Cart } = require('../../database/models');

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
    const carts = await Cart.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(carts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const carts = await Cart.create(req.body);

    res.status(200).send(carts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const carts = await Cart.findOne({ where: { id: req.params.id } });

    await carts.destroy();
    res.status(200).send(carts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const carts = await Cart.findOne({ where: { id: req.params.id } });
    await carts.update(req.body);

    res.status(200).send(carts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
