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

function sendToken(email, token) {
  return emailSender.send({
    template: buildPath('send-token'),
    message: {
      to: email,
    },
    locals: {
      token,
    },
  });
}

module.exports = {
  sendToken,
};
