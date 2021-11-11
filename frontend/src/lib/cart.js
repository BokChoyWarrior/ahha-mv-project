import axios from './axios';

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

export const incrementCartItem = async (userId, itemId, amount = 1) => {
  const response = await axios.post(`/carts/${userId}/cartItems/`, {
    itemId: itemId,
    amountToAdd: amount,
  });
  return response;
};
export const getCartDetails = async (cartItems) => {
  const allItemsReq = await axios.get('/items');
  const items = allItemsReq.data;
  const cartDetails = items.map((item) => {
    const match = cartItems.find((cartItem) => cartItem.id === item.id);
    if (match) {
      return {
        ...match,
        ...item,
      };
    }
  });
  return cartDetails.filter((item) => item);
};

export const updateCartItemQuant = async (itemId, quantity) => {
  await axios.put(`/cartItems/${itemId}`, { quantity: quantity });
};

export const deleteItemFromCart = async (itemId) => {
  await axios.delete(`/cartItems/${itemId}`);
};

/* needs work */
// export const makeIncQuantReq = async (userId, itemId) => {
//   const userCartReq = await getUsersCart(userId);
//   const userCart = userCartReq.data;

//   console.log(userCart);
// };
