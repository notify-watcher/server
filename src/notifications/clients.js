const keymirror = require('keymirror');
const {
  clientHandler: emailHandler,
  clientKind: emailKind,
  clientRequiredKeys: emailRequiredKeys,
} = require('./email');
const {
  clientHandler: telegramHandler,
  clientKind: telegramKind,
  clientRequiredKeys: telegramRequiredKeys,
} = require('./telegram');

const clientHandlers = {
  [emailKind]: emailHandler,
  [telegramKind]: telegramHandler,
};

const clientKinds = keymirror({
  [emailKind]: null,
  [telegramKind]: null,
});

const clientRequiredKeys = {
  [emailKind]: emailRequiredKeys,
  [telegramKind]: telegramRequiredKeys,
};

module.exports = {
  clientHandlers,
  clientKinds,
  clientRequiredKeys,
};
