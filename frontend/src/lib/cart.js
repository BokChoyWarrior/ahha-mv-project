import axios from './axios';

/**
 * makes a GET request /carts endpoint for logged in users cart
 * @param {number} userId
 * @returns Object containing items in users cart with associated item details
 */

export const getUsersCart = async (userId) => {
  const response = await axios.get(`/carts/${userId}/cartItems`);
  return response.data;
};

/**
 * Tries to increment a user's cartItem by quantity.
 * If the resulting quantity is 0 or negative, the item will be removed from the user's cart
 * @param {number} userId
 * @param {number} itemId
 * @param {number} amount
 */
export const incrementCartItem = async (userId, itemId, amount = 1) => {
  const response = await axios.post(`/carts/${userId}/cartItems/`, {
    itemId: itemId,
    amountToAdd: amount,
  });
  return response;
};

/**
 * requests deletion of item from cart using userId and the itemId from '/cartItems' endpoint
 * @param {number} itemId
 * @param {number} userId
 */

export const deleteItemFromCart = async (itemId, userId) => {
  return await axios.delete(`/cartItems/${itemId}?cartId=${userId}`);
};
