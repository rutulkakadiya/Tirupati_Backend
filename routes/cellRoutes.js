const express = require('express');
const router = express.Router();
const cellController = require('../controllers/cellController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, cellController.getCells);
router.post('/', authenticateToken, cellController.updateCell);

module.exports = router;
