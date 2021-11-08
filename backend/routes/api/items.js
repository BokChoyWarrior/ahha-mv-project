const express = require('express');
const router = express.Router();
const { Item } = require('../../database/models');

router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({});

    res.status(200).send(items);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);

    res.status(200).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });

    await item.destroy();
    res.status(200).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });
    await item.update(req.body);

    res.status(200).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
