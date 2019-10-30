const Router = require('koa-router');
const WatchersController = require('../controllers/watchers');

const router = new Router();
router.get('/', WatchersController.list);
router.get('/:watcher', WatchersController.show);

module.exports = router;
