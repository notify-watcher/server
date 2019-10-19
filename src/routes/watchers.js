const Router = require('koa-router');
const WatchersController = require('../controllers/watchers');

const router = new Router();
router.get('/', WatchersController.list);

module.exports = router;
