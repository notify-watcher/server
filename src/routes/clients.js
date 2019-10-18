const Router = require('koa-router');
const ClientsController = require('../controllers/clients');

const router = new Router();

router.post('/register', ClientsController.register);

module.exports = router;
