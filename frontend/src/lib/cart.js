import axios from './axios';

export const getUsersCart = async (userId) => {
  const getCartItems = await axios.get('/cartItems');
  const userCart = getCartItems.data.filter((item) => item.CartId === userId);
  return userCart;
};

export const makeAddToCartReq = async (userId, item) => {
  const getCartItem = await axios.get(`/cartItems/${item.id}`);
  const data = getCartItem.data;
  if (!Object.values(data).length) {
    return await axios.post('/cartItems', { id: item.id, quantity: 1, CartId: userId });
  }
};

/* needs work */
export const makeIncQuantReq = async (userId, itemId) => {
  const userCartReq = await getUsersCart(userId);
  const userCart = userCartReq.data;

  console.log(userCart);
};
