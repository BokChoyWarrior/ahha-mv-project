import axios from 'axios';

/**
 * sets base url for axios requests - entire url doesn't need to be specified
 */

export default axios.create({
  baseURL: 'http://localhost:3000/api',
});
