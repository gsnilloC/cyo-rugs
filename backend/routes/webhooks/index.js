const express = require('express');
const router = express.Router();

router.use('/payment', require('./payment'));
router.use('/inventory', require('./inventory'));

module.exports = router;
