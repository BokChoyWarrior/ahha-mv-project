import axios from './axios';

/**
 * makes a GET request /carts endpoint for logged in users cart
 * @returns items in users cart with associated item details
 */

export const getUsersCart = async (userId) => {
  const response = await axios.get(`/carts/${userId}/cartItems`);
  // CHECK ERRORS
  return response.data;
};

// export const addToCart = async (userId, itemId) => {
//   const getCartItem = await axios.get(`/carts/${userId}/cartItems/items?itemId=${itemId}`);
//   const data = getCartItem.data;
//   if (!Object.values(data).length) {
//     return await axios.post('/cartItems', { id: item.id, quantity: 1, CartId: userId });
//   }
// };

// updates item in carts quantity
export const incrementCartItem = async (userId, itemId, amount = 1) => {
  const response = await axios.post(`/carts/${userId}/cartItems/`, {
    itemId: itemId,
    amountToAdd: amount,
  });
  return response;
};

// deletes item from cart by cartId/userId and the itemId
export const deleteItemFromCart = async (itemId, userId) => {
  await axios.delete(`/cartItems/${itemId}?cartId=${userId}`);
};
