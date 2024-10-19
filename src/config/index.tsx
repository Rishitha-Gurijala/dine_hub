import {ENDPOINTS} from './endpoints';

const DEBUG = true;
// const BASE_URL = 'http://127.0.0.1:8000/';
const BASE_URL = 'http://localhost:3000/';
const AUTHORIZATION_TOKEN = '';

const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
  },
};

export {BASE_URL, AUTHORIZATION_TOKEN, ENDPOINTS, CONFIG, DEBUG};
