const WatchersController = require('../controllers/watchers');

module.exports = ({ watchersRouter }) => {
  watchersRouter.get('/', WatchersController.list);
};
