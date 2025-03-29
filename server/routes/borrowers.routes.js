const express = require('express');
const router = express.Router();
const borrowersController = require('../controllers/borrowers.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', borrowersController.getAll);
router.get('/:id', borrowersController.getById);
router.post('/', borrowersController.create);
router.put('/:id', borrowersController.update);
router.delete('/:id', borrowersController.delete);

module.exports = router;
