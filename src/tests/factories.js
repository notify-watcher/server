/* eslint-disable import/no-extraneous-dependencies */
const { Factory } = require('rosie');
const keyMirror = require('keymirror');

const factoryNames = keyMirror({
  koaCtx: null,
});

Factory.define(factoryNames.koaCtx).attrs({
  assert: () =>
    jest.fn((assertion, error) => {
      if (assertion) return;
      throw error;
    }),
  params: () => ({}),
  query: () => ({}),
  redirect: () => jest.fn(),
  request: () => ({}),
  set: () => jest.fn(),
  state: () => ({}),
  t: () => text => text,
  throw: () =>
    jest.fn(err => {
      throw err;
    }),
});

module.exports = {
  Factory,
  factoryNames,
};
