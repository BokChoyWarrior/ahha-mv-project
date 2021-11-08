const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/db.sqlite',
});

const categoriesModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
};

const cartModel = {};

const cartItemsModel = {
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
    },
  },
};

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

Item.belongsTo(Category);

Category.hasMany(Item);

Cart.hasMany(CartItem);

CartItem.belongsTo(Cart);

module.exports = { sequelize, Item, Category, Cart, CartItem };
