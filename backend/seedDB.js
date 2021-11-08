const { readFileSync } = require('fs');

const { sequelize, CartItem, Cart, Item, Category } = require('./database/models');

// ONLY run this if the universe explodes and we need new items

// (async () => {
//   const items = JSON.parse(readFileSync('./item-data.json', 'utf8'));

//   await sequelize.sync({ force: true });

//   const cat2 = await Category.create({ name: 'Jewellery' });
//   const cat3 = await Category.create({ name: 'Electronics' });
//   const cat4 = await Category.create({ name: "Women's Clothing" });
//   const cat1 = await Category.create({ name: "Men's Clothing" });

//   items.forEach(async (_item) => {
//     const item = await Item.create({
//       name: _item.title,
//       imageLink: _item.imageLink,
//       description: _item.description,
//       price: _item.price,
//       CategoryId: _item.category,
//     });

//     item.save();

//     const _items = await Item.findAll();
//     console.log(_items);
//   });
//   const cats = await Category.findAll();
//   console.log(cats);
// })();
