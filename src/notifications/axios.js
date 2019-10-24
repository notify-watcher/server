const axios = require('axios');
const { api } = require('../config');

const { headerName, headerValue } = api.authToken;

const instance = axios.create({
  headers: {
    [headerName]: headerValue,
  },
});

module.exports = instance;
