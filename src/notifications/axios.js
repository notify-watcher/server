const axios = require('axios');
const { api } = require('../config');

const { headerName, headerValue } = api.authToken;

const instance = axios.create();
instance.defaults.headers.common[headerName] = headerValue;

module.exports = axios;
