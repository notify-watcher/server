const Router = require('koa-router');
const SubscriptionsController = require('../controllers/subscriptions');

const router = new Router();

router.post('/subscribe', SubscriptionsController.subscribe);

module.exports = router;
