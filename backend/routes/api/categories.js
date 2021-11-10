const express = require('express');
const router = express.Router();
const { Category, Item } = require('../../database/models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({});

    res.status(200).send(categories);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id', async (req, res) => {
  const { getNested = false } = req.query;

  const nestedParams = getNested
    ? {
        include: Item,
      }
    : {};

  try {
    const category = await Category.findByPk(req.params.id, nestedParams);

    if (category) {
      res.status(200).send(category);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });

    if (category) {
      await category.destroy();
      res.status(200).send(category);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });

    if (category) {
      await category.update(req.body);
      res.status(200).send(category);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const response = await Category.findByPk(req.params.id, {
      include: Item,
    });

    if (response) {
      res.status(200).send(response.Items);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
