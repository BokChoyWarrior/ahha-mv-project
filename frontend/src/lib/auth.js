import axios from './axios';

/**
 * Checks if a cart exists with `userId` and returns cart if so.
 * @param {number} userId
 * @returns {Object | false}
 */
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

/**
 * Takes userId from localStorage and then tries to {@link authUser}
 */
export async function authLocalUser() {
  const localUser = getLocalUser();

  if (localUser) {
    return await authUser(localUser);
  } else {
    return false;
  }
}

export async function setLocalUser(userId) {
  localStorage.setItem('user', userId);
}

/**
 * checks localStorage for user sesssion
 * @returns userId; a number, if exists; otherwise null
 */
export function getLocalUser() {
  return localStorage.getItem('user');
}

/**
 * Removes user key-value pair from localStorage
 */

export async function clearLocalUser() {
  localStorage.removeItem('user');
}
