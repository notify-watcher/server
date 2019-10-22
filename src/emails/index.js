const Email = require('email-templates');
const path = require('path');

const emailSender = new Email({
  message: {
    from: 'noreply@notify-watcher.org',
  },
  send: true,
  transport: {
    host: 'localhost',
    port: 1025,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  },
});

function buildPath(emailFolder) {
  return path.join(__dirname, emailFolder);
}

module.exports = {
  emailSender,
  templates: {
    sendToken: buildPath('send-token'),
  },
};
