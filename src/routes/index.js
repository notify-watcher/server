const Router = require('koa-router');
const baseRouter = require('./base');
const usersRouter = require('./users');
const clientsRouter = require('./clients');
const subscriptionsRouter = require('./subscriptions');
const watchersRouter = require('./watchers');

const router = new Router();
router.use('/', baseRouter.routes());
router.use('/users', usersRouter.routes());
router.use('/clients', clientsRouter.routes());
router.use('/subscriptions', subscriptionsRouter.routes());
router.use('/watchers', watchersRouter.routes());

module.exports = router;
