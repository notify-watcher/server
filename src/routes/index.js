const Router = require('koa-router');
const baseRouter = require('./base');
const watchersRouter = require('./watchers');

const router = new Router();
router.use('/', baseRouter.routes());
router.use('/watchers', watchersRouter.routes());

module.exports = router;
