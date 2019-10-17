const Router = require('koa-router');
const ClientsController = require('../controllers/clients');

const router = new Router();

router.post('/register', ClientsController.register);
router.get('/verify', ClientsController.verify);

module.exports = router;
