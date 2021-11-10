import axios from './axios';

// Thismethod takes a userId and checks if a cart exists with that ID. If so returns the cart, else, false
// userId will actually reference a Cart model
export async function authUser(userId) {
  try {
    const response = await axios.get(`/cart/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (e) {
    return false
  }
}

export function getUserFromLocal() {
  return localStorage.getItem('user')
}

export async function verifyLocalUser() {
  const localUser = getUserFromLocal()

  if (localUser) {
    return await authUser(localUser)
  } else {
    return false
  }
}

export function saveUserToLocal(userId) {
  localStorage.setItem('user', userId)
}