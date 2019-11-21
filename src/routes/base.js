const Router = require('koa-router');
const { version } = require('../../package.json');

const router = new Router();

router.get('/', ctx => {
  ctx.body = {
    active: true,
    datetime: new Date(),
    version,
  };
});

module.exports = router;
