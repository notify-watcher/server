const Router = require('koa-router');
const UsersController = require('../controllers/users');

const router = new Router();

router.post('/send-token', UsersController.sendToken);

module.exports = router;
