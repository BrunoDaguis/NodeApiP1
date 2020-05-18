'use strinct'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/article-controller');
const authService = require('../services/auth-services');

router.get('/', authService.authorize, controller.get);
router.post('/', authService.authorize, controller.post);

module.exports = router;