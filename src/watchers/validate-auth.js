function validateAuth({ config: { auth } }) {
  if (!auth) return true;
  // TODO: Here we should check the auth object for a valid auth specification
  // this means, config.auth should contain all required fields for
  // running the authenticated watcher
  return true;
}

module.exports = validateAuth;
