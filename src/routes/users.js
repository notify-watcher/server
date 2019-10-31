const Router = require('koa-router');
const UsersController = require('../controllers/users');
const { setUserInstace } = require('../middleware');

const router = new Router();

router.post('/:email/token', UsersController.sendToken);

router.use('/:email', setUserInstace);

router.get('/:email', UsersController.getUser);
router.post('/:email/clients', UsersController.registerClient);
router.post('/:email/subscriptions', UsersController.subscribeWatcher);

module.exports = router;
