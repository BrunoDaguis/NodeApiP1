'use strinct'

const express = require('express');
const router = express.Router();
const authService = require('../services/auth-services');
const controller = require('../controllers/authenticate-controller');

router.post('/', controller.authenticate);
router.post('/refresh', authService.authorize, controller.refresh);

module.exports = router;