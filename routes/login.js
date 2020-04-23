const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login.js');


module.exports = (passport) => {
    console.log('Registering login routes...');

    router.get('/login', loginController.getLogin(passport), loginController.redirectHome);
    router.post('/login/callback', loginController.postLogin(passport), loginController.redirectHome);

    return router;
};