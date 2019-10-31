const Router = require('koa-router');
const UsersController = require('../controllers/users');

const router = new Router();

router.post('/send-token', UsersController.sendToken);

router.get('/:email', UsersController.show);
router.post('/:email/clients', UsersController.registerClient);
router.post('/:email/subscriptions', UsersController.subscribeWatcher);

module.exports = router;
