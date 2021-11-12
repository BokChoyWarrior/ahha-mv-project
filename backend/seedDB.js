const { readFileSync } = require('fs');

const { sequelize, CartItem, Cart, Item, Category } = require('./database/models');

/**
 * Seeds/populates (fills) the Category and Item tables in the database with initial data from file seedDB.js
 */

// ONLY run this if the universe explodes and we need new items

// Migrate 1
// (async () => {
//   const items = JSON.parse(readFileSync('./item-data.json', 'utf8'));

//   await sequelize.sync({ force: true });

//   const cat2 = await Category.create({
//     name: 'Jewellery',
//     imageLink: `https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260`,
//   });
//   const cat3 = await Category.create({
//     name: 'Electronics',
//     imageLink: `https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260`,
//   });
//   const cat4 = await Category.create({
//     name: "Women's Clothing",
//     imageLink: `https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260`,
//   });
//   const cat1 = await Category.create({
//     name: "Men's Clothing",
//     imageLink: `https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260`,
//   });

//   items.forEach(async (_item) => {
//     const item = await Item.create({
//       name: _item.title,
//       imageLink: _item.imageLink,
//       description: _item.description,
//       price: _item.price,
//       CategoryId: _item.category,
//     });

//     item.save();
//   });
//   const user1 = await Cart.create();
//   await user1.save();
// })();
