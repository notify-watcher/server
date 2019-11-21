const Router = require('koa-router');

const router = new Router();

router.get('/', ctx => {
  ctx.body = {
    active: true,
    datetime: new Date(),
  };
});

module.exports = router;
