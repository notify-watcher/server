const Router = require('koa-router');
const UsersController = require('../controllers/users');

const router = new Router();

router.get('/:email', UsersController.show);
router.post('/send-token', UsersController.sendToken);

module.exports = router;
