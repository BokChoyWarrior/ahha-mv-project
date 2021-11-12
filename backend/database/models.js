const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/db.sqlite',
});

/**
 * Categories Model
 * Makes a table for Category data
 */

const categoriesModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  imageLink: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isURL: true,
    },
  },
};

/**
 * Cart model
 * Makes a table for cart data
 * contains only cart id primary key
 * users are carts and user ids are cart ids
 */

const cartModel = {};

/**
 * Cart Item model
 * makes a table for items that are in a cart
 */

const cartItemsModel = {
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
    },
  },
};

/**
 * items model
 * makes a table for items
 * with columns for model keys
 */

const itemsModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      //   is: ['^[a-zA-Z0-9_ ]*$'],
    },
  },
  imageLink: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isURL: true,
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
    },
  },
};

const Category = sequelize.define('Category', categoriesModel);
const Cart = sequelize.define('Cart', cartModel);
const CartItem = sequelize.define('CartItem', cartItemsModel);
const Item = sequelize.define('Item', itemsModel);

// one to many
Item.belongsTo(Category);
Category.hasMany(Item);

// many to many
Cart.belongsToMany(Item, {
  through: CartItem,
});
Item.belongsToMany(Cart, {
  through: CartItem,
});

module.exports = { sequelize, Item, Category, Cart, CartItem };
