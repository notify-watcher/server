const {
  constants: { CLIENT_KINDS, DEFAULT_CLIENT_IDS },
} = require('@notify-watcher/core');
const {
  CLIENT_KIND_HANDLERS,
  DEFAULT_CLIENT_FOR_USER_HANDLERS,
} = require('./');

describe('clientKindHandlers', () => {
  it('has a handler for each client kind', () => {
    Object.keys(CLIENT_KINDS).forEach(clientKind =>
      expect(CLIENT_KIND_HANDLERS[clientKind]).toBeDefined(),
    );
  });
});

describe('defaultClientForUserHandlers', () => {
  it('has a handler for each default client id', () => {
    Object.keys(DEFAULT_CLIENT_IDS).forEach(clientId =>
      expect(DEFAULT_CLIENT_FOR_USER_HANDLERS[clientId]).toBeDefined(),
    );
  });
});
