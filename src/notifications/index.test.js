const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const { CLIENT_KIND_HANDLERS } = require('./');

describe('clientKindHandlers', () => {
  it('has a handler for each client kind', () => {
    Object.keys(CLIENT_KINDS).forEach(clientKind =>
      expect(CLIENT_KIND_HANDLERS[clientKind]).toBeDefined(),
    );
  });
});
