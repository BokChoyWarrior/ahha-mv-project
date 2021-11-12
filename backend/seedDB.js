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
//     imageLink: `https://c.pxhere.com/photos/94/10/church_rosary_religion_christian_catholic_faith-1029472.jpg!s`,
//   });
//   const cat3 = await Category.create({
//     name: 'Electronics',
//     imageLink: `https://p0.pikist.com/photos/786/200/macro-electronics-printed-circuit-boards-integrated-circuits-circuit-board-computer-engineering-chip-thumbnail.jpg`,
//   });
//   const cat4 = await Category.create({
//     name: "Women's Clothing",
//     imageLink: `https://c.pxhere.com/photos/cb/95/fashion_girl_glamour_attractive_woman_model_clothing_traditional-797484.jpg!s`,
//   });
//   const cat1 = await Category.create({
//     name: "Men's Clothing",
//     imageLink: `https://ca.slack-edge.com/TCX5TJ8DD-U01CRLBTTR6-c43403faeb3f-512`,
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
