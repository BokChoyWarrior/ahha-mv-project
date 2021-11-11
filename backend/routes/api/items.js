const express = require('express');
const router = express.Router();
const { Item } = require('../../database/models');

/**
 * Item Model Api Routes
 */

/**
 * READ All Items model Endpoint. If entries exist, sends all entries to requester; otherwise sends an error status code and message
 */

router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({});

    res.status(200).send(items);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * READ One Item model Endpoint. If item, that matches id url parameter exists, sends item entry, otherwise sends 404 - resource not found status code.
 * If an error occurs returns 400 status code: bad request and sends error message
 */

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (item) {
      res.status(200).send(item);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * CREATE Item Enpoint. Adds item to Items table, sends status code 200- ok- and sends back entry that was created
 */

router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);

    res.status(200).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * DELETE Item Endpoint. Deletes one item by url id parameter from Items table. Sends 200 status code if succesful. If item with id does not exists sends 404-not found.
 * If an error occurs sends 400- bad request if an error occurs and error message
 */

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });

    if (item) {
      await item.destroy();
      res.status(200).send(item);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * UPDATE Item table endpoint. Updates item in Item table which matches id url parameter if item exists, and sends back 200 status code. If non-existant
 * sends back 404 status code. If an error occurs during the query of the model, sends back 400 code with error message
 */

router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });

    if (item) {
      await item.update(req.body);
      res.status(200).send(item);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
