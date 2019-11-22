const Router = require('koa-router');
const config = require('../config');

const router = new Router();

router.get('/', ctx => {
  ctx.body = {
    active: true,
    datetime: new Date(),
    version: `v${config.VERSION}`,
    versionDescribe: config.GIT_DESCRIBE,
  };
});

module.exports = router;
