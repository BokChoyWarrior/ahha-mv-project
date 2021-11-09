import axios from './axios';

// Thismethod takes a userId and checks if a cart exists with that ID. If so returns the cart, else, false
// userId will actually reference a Cart model
export async function authUser(userId) {
  const response = await axios.get(`/cart/${userId}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return false;
  }
}
