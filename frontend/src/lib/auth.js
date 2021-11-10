import axios from './axios';

// Thismethod takes a userId and checks if a cart exists with that ID. If so returns the cart, else, false
// userId will actually reference a Cart model
export async function authUser(userId) {
  try {
    const response = await axios.get(`/carts/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

// Doesn't need userID, takes it from localstorage
export async function authLocalUser() {
  const localUser = getLocalUser();

  if (localUser) {
    return await authUser(localUser);
  } else {
    return false;
  }
}

// Needs a userId and saves to localstorage
export async function setLocalUser(userId) {
  localStorage.setItem('user', userId);
}

export function getLocalUser() {
  return localStorage.getItem('user');
}

export async function clearLocalUser() {}
