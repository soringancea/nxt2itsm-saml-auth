const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login.js');

console.log('Registering login routes...');

router.get('/login', loginController.getLogin, loginController.redirectHome);
router.post('/login/callback', loginController.postLogin, loginController.redirectHome);

module.exports = router;