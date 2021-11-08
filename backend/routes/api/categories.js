const express = require('express');
const router = express.Router();
const { Category } = require('../../database/models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({});

    res.status(200).send(categories);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(category);
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

    await category.destroy();
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    await category.update(req.body);

    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
